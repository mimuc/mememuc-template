import {useEffect, useMemo, useRef, useState} from "react";
import {useAsync, useEffectOnce, useLocalStorage, useUnmount} from "react-use";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import Webcam from "react-webcam";
import {Card, Col, Input, Modal, Radio, Row, Select, Form} from "antd";
import {
    AppstoreOutlined,
    CameraOutlined,
    DownloadOutlined,
    LinkOutlined,
    PictureOutlined
} from "@ant-design/icons";
import {useEditorState, useMemesState, useSelectedShapeIdState, useSessionState, useStageRef} from "src/states";
import {downloadURI, isImgUrl} from "src/utils";
import {MemeType, SessionType} from "src/types";
import Cookies from "js-cookie";
import {api} from "src/api";

export * from './state-hooks';

export const useAutoplay = () => {
    const [timer, setTimer] = useState<number>(0);
    const {memeId} = useParams();
    const [memes,] = useMemesState();
    const [autoplay, setAutoplay] = useState<number | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const startAutoplay = () => {
        searchParams.set('autoplay', '5');
        setSearchParams(searchParams);
    }
    const stopAutoplay = () => {
        setAutoplay(null);

        searchParams.delete('autoplay');
        setSearchParams(searchParams);
        clearTimeout(timer);
    }

    useEffect(() => {
        const autoplayParam = searchParams.get('autoplay');
        const autoplay = autoplayParam && !isNaN(parseInt(autoplayParam)) ? parseInt(autoplayParam) : null;
        setAutoplay(autoplay);

        if (autoplay) {
            // Cycle through list of memes with modulo
            const timer: any = setTimeout(() => {
                const index = memes.findIndex(meme => meme.publicId === memeId);
                const nextMeme = memes[(index + 1) % memes.length];
                navigate(`/memes/${nextMeme.publicId}?${searchParams}`);
            }, autoplay * 1000);
            setTimer(timer);
        }
    }, [searchParams, memeId, memes, navigate]);

    useUnmount(() => clearTimeout(timer));

    return {
        autoplay,
        startAutoplay,
        stopAutoplay
    };
}

export const useImgflipInputModal = () => {
    const memesLoadable = useAsync(() => fetch('https://api.imgflip.com/get_memes').then(res => res.json()));

    return () => new Promise<string | undefined>(resolve =>
        Modal.info({
            width: 1000,
            closable: true,
            icon: <AppstoreOutlined/>,
            title: 'Enter Imgflip URL',
            content: <Row gutter={[16, 16]}>
                {
                    memesLoadable.value && memesLoadable.value.data.memes.map((i: any) => (
                        <Col span={8} key={i.id}>
                            <Card title={i.name} hoverable onClick={() => {
                                resolve(i.url);
                                Modal.destroyAll()
                            }}>
                                <img src={i.url} style={{maxHeight: '100%', maxWidth: '100%'}} alt={'Template'}/>
                            </Card>
                        </Col>
                    ))
                }
            </Row>,
            onCancel: () => resolve(undefined),
            footer: null
        })
    );
}

export const useUrlInputModal = () => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    return () => new Promise<string | undefined>(resolve =>
        Modal.info({
            closable: true,
            icon: <LinkOutlined/>,
            title: 'Enter image URL',
            content: <Input placeholder={'Image URL'} onChange={(e: any) => {
                setImageUrl(e.target.value)
            }}/>,
            onOk: () => {
                const url = imageUrl && imageUrl.trim();
                if (url && isImgUrl(url)) resolve(url);
                else resolve(undefined);
            }
        })
    );
}

export const useWebcamInputModal = () => {
    const webcamRef = useRef();

    return () => new Promise<string | undefined>(resolve =>
        Modal.info({
            closable: true,
            width: 690,
            icon: <CameraOutlined/>,
            title: 'Take a photo',
            bodyStyle: {paddingInline: 0},
            content: <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Webcam
                    width={640}
                    audio={false}
                    ref={webcamRef as any}
                    screenshotFormat={"image/jpeg"}
                />
            </div>,
            onOk: () => {
                if (webcamRef.current == null) return;

                const webcam = webcamRef.current as Webcam;
                const imageSrc = webcam.getScreenshot();

                if (imageSrc) fetch(imageSrc).then(res => res.blob()).then(blob => {
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                });
            }
        })
    );
}

export const useShape = <T, >(id: string | null) => {
    const [shapes, setShapes] = useEditorState();
    const [shape, setShape] = useState<T | null>(shapes.find(s => s.id === id) as T || null);

    const updateShape = (values: Partial<Omit<T, 'id'>>) => {
        setShapes(prev => prev.map(s => s.id === id ? {...s, ...values} : s));
        setShape(prev => prev ? {...prev, ...values} : null);
    }

    const deleteShape = () => {
        setShape(null);
        setShapes(shapes.filter(s => s.id !== id));
    }

    useEffect(() => {
        if (id) {
            setShape(shapes.find(s => s.id === id) as T);
        }
    }, [id, shapes]);

    return {shape, updateShape, deleteShape};
}

export const useScreenshot = () => {
    // TODO: Screenshot does not capture the entire screen

    return async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia();
        const track = stream.getTracks()[0];
        const imageCapture = new ImageCapture(track);
        const screenshotUrl = await imageCapture.grabFrame().then((bitmap) => {
            var MAX_WIDTH = 300;
            var MAX_HEIGHT = 300;

            var width = bitmap.width;
            var height = bitmap.height;

            // Change the resizing logic
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width = width * (MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                }
            }

            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d') as CanvasRenderingContext2D;
            context.drawImage(bitmap, 0, 0, width, height)
            return canvas.toDataURL();
        });
        track.stop();

        return screenshotUrl;
    }
}

export const useDownloadModal = () => {
    const [stageRef,] = useStageRef();
    const [form] = Form.useForm();
    const [memes] = useMemesState();
    const [, setSelectedShapeId] = useSelectedShapeIdState();

    // If no id is provided, download the current meme from the editor
    return (id?: string) => new Promise<string | undefined>(resolve => {
        Modal.info({
            title: 'Download',
            icon: <DownloadOutlined/>,
            content: 
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{filesize: 1000, fileformat: 'png'}}
                >
                    <Form.Item
                        name="filesize"
                        label="File size (KB)"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="fileformat" className="collection-create-form_last-form-item">
                        <Select
                            options={[{label: 'PNG', value: 'png'}, {label: 'JPEG', value: 'jpeg'}]}
                        />
                    </Form.Item>
                </Form>
                ,
            onOk: async () => {
                form
                    .validateFields()
                    .then(async values => {
                        setSelectedShapeId(null);
                        setTimeout(async () => {
                            let url = '';

                            if (!id) {
                                url = stageRef.current.toDataURL();
                            } else {
                                const meme = memes.find(m => m.publicId === id);
                                if(meme) {
                                    url = await fetch(meme.imageUrl)
                                    .then(res => res.blob())
                                    .then(blob => URL.createObjectURL(blob));
                                }
                                else {
                                    // TODO: ERROR
                                    return;
                                }
                            }

                            downloadURI(url, 'meme', (values.fileformat ?? 'png'), values.filesize ?? 1000);
                            URL.revokeObjectURL(url);
                            resolve(undefined);

                        }, 1000);
                    })
            }
        })
    });
}

export const useCreateTemplateModal = (onTemplateCreate: (values: any) => void) => {
    const [form] = Form.useForm();

    return () => new Promise<string | undefined>(resolve => {
        Modal.info({
            closable: true,
            title: 'Create template',
            icon: <PictureOutlined/>,
            content:
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{visibility: 'public'}}
                >
                    <Form.Item
                        name="name"
                        label="Template name (required)"
                        rules={[{required: true, message: 'Please input the name of the template!'}]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>,
            onOk: async () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        form.resetFields();
                        onTemplateCreate(values);
                        resolve(undefined);
                    })
                    .catch((info) => {
                        // TODO: Warn, instead of closing dialogue
                        console.log('Validate Failed:', info);
                        resolve(undefined);
                    });
            }
        });
    });
}

export const useCreateMemeModal = (onMemeCreate: (values: any) => void) => {
    const [form] = Form.useForm();
    const [, setSelectedShapeId] = useSelectedShapeIdState();

    return () => new Promise<string | undefined>(resolve => {
        Modal.info({
            closable: true,
            title: 'Create meme',
            icon: <PictureOutlined/>,
            content:
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{visibility: 'public'}}
                >
                    <Form.Item
                        name="name"
                        label="Meme name (required)"
                        rules={[{required: true, message: 'Please input the name of the meme!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="visibility" className="collection-create-form_last-form-item">
                        <Radio.Group>
                            <Radio value="public">Public</Radio>
                            <Radio value="unlisted">Unlisted</Radio>
                            <Radio value="private">Private</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>,
            onOk: async () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        form.resetFields();
                        setSelectedShapeId(null);
                        setTimeout(async () => onMemeCreate(values), 1000);
                        resolve(undefined)
                    })
                    .catch((info) => {
                        // TODO: Warn, instead of closing dialogue
                        console.log('Validate Failed:', info);
                        resolve(undefined)
                    });
            }
        });
    });
}

export const useAuth = () => {
    const [persistentSession, setPersistentSession] = useLocalStorage<SessionType | null>('session', null);
    const [session, setSession] = useSessionState();

    useEffectOnce(() => {
        setSession(persistentSession as SessionType)
    });

    useEffect(() => {
        setPersistentSession(session);
    }, [session]);

    const login = async (token: string, expiryTime: string) => {
        Cookies.remove('token');
        Cookies.set('token', token, {
            expires: Date.parse(expiryTime),
            sameSite: 'lax'
        });
        await api.my.account().then((data) => {
            setSession(data as SessionType);
        });
    }

    const logout = () => {
        setSession(null)
        Cookies.remove('token');
    }

    return {session, login, logout};
}

export const useMeme = (id: string) => {
    const [memes, setMemes] = useMemesState();

    const meme: MemeType | null = useMemo(() => memes?.find((m: MemeType) => m.publicId === id) || null, [memes, id]);

    useEffect(() => {
        const query = memes?.find((m: MemeType) => m.publicId === id);

        if (!query) {
            api.memes.get(id).then((data) => {
                setMemes([data, ...memes]);
            }).catch(() => {
                throw new Response("Meme not found", {status: 404});
            });
        }
    }, [id, memes, setMemes])

    const toggleLike = async () => {
        if (!meme) return;

        let updatedMeme = {};

        if (meme.vote == 1) {
            await api.memes.upvoteRemove(meme.publicId)
            updatedMeme = {likes: meme.likes - 1, vote: 0};
        } else {
            await api.memes.upvote(meme.publicId)
            updatedMeme = {
                likes: meme.likes + 1,
                dislikes: meme.vote === -1 ? meme.dislikes - 1 : meme.dislikes,
                vote: 1
            };
        }

        setMemes(prev => prev.map(m => m.publicId === meme.publicId ? {...m, ...updatedMeme} : m))
    }

    const toggleDislike = async () => {
        if (!meme) return;

        let updatedMeme = {};

        if (meme.vote === -1) {
            await api.memes.downvoteRemove(meme.publicId)
            updatedMeme = {dislikes: meme.dislikes - 1, vote: 0};

        } else {
            await api.memes.downvote(meme.publicId)
            updatedMeme = {
                dislikes: meme.dislikes + 1,
                likes: meme.vote === 1 ? meme.likes - 1 : meme.likes,
                vote: -1
            };
        }

        setMemes(prev => prev.map(m => m.publicId === meme.publicId ? {...m, ...updatedMeme} : m))
    }

    return {meme, toggleLike, toggleDislike} as const;
}
