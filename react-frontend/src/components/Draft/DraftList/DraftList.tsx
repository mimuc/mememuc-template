import {Alert, Empty} from "antd";
import {useDrafts} from "src/hooks";
import {DraftItem} from "src/components/Draft/DraftItem/DraftItem";

export const DraftList = () => {
    const {drafts} = useDrafts();

    return (
        <div style={{height: 300, width: '100%', overflow: 'auto', whiteSpace: 'nowrap'}}>
            {drafts && drafts.length > 0 && drafts.map(d => <DraftItem
                    key={d.id}
                    draft={d}
                />
            )}
            {(!drafts || drafts.length === 0) && <Alert message={<Empty description={'No drafts found'}/>}/>}
        </div>
    );
}