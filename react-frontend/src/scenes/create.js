import React from "react";
import {Text, Image, View, StyleSheet} from "react-native";
import { ImageBackground } from "react-native-web";

/*
Names of each component:
1. Image 1 = background image
2. Rectangle 7 = bar with Download/Share; Save Draft; Post buttons
    2.1.Rectangle 10 = Mix color effect of the button of Safe Draft
3. Rectangle 9 = Post button
4. Rectangle 11 = Download/Share button
5. Reactangle 1 = bar with Meme Generato; Create; Discover; Karni buttons
6. Meme Generator = textbox home-page
7. Rectangle 3 = Karni button
8. Karni = text box profile-page
9. Rectangle 2 = Create button
10.Create = textbox create-page
11.Discover = textbox discover-page
12.Rectangle 8 = top-part of the canvas (where there is the edited meme)
13.Image 8 = editor/canvas commands and options --> VERY IMPORTANT TO CREATE FROM SCRATCH
14.flat-550x5500x075xf1 = god meme image
15.Download/Share = textbox download/share command
16.Save Draft = textbox save draft command
17.Post = textbox post command
*/

export default function Create(){
    return (
        <>
            <h1>Create</h1>
            <ImageBackground style = {ourStyleSheet.styleImage1} source = {{uri: "https://nyc3.digitaloceanspaces.com/sizze-storage/mdia/images/8Vy5x5uX5RBNdOtig8VlgXij.png"}}> </ImageBackground>
            <View style = {ourStyleSheet.styleRectangle9}> </View>
            <View style = {ourStyleSheet.styleRectangle11}> </View>
            <View style = {ourStyleSheet.styleRectangle1}> 
                <Text style = {ourStyleSheet.styleMemeGenerator}> Meme Generator </Text>
                <View style = {ourStyleSheet.styleRectangle3}> 
                    <Text style = {ourStyleSheet.styleKarni}> Karni </Text>
                </View>
                <View style = {ourStyleSheet.styleRectangle2}> 
                    <Text style = {ourStyleSheet.styleCreate}> Create </Text>
                </View>
                <Text style = {ourStyleSheet.styleDiscover}> Discover </Text>
            </View>
            <View style = {ourStyleSheet.styleRectangle7}> 
                <Text style = {ourStyleSheet.styleDownloadShare}> Download/Share </Text>
                <View style = {ourStyleSheet.styleRectangle10}> 
                <Text style = {ourStyleSheet.styleSaveDraft}> Save draft </Text>
                </View> 
                <Text style = {ourStyleSheet.stylePost}> Post </Text>
            </View>
            <View style = {ourStyleSheet.styleRectangle8}> </View>
            <Image style = {ourStyleSheet.styleImage8} source = {{uri: "https://nyc3.digitaloceanspaces.com/sizze-storage/mdia/images/1OC9AYf4A2ctDAml6VJdTe9D.png"}}> </Image>
            <Image style = {ourStyleSheet.styleFlat550x550075F1} source = {{uri: "https://nyc3.digitaloceanspaces.com/sizze-storage/mdia/images/wCcAzCp721T5gGzETiGoIV9Z.png"}}> </Image>
        </>
    )
}

const ourStyleSheet = StyleSheet.create({
    styleImage1: {
        position:"absolute",
        left: 0,
        top: 81,
        width: 1728,
        height: 1036,
    },

    styleRectangle10: {
        position:"absolute",
        left: 1237,
        top: 1,
        width: 158,
        height: 62,
    },

    styleRectangle7: {
        position:"absolute",
        left: 80,
        top: 82,
        width: 1588,
        height: 62,
    },

    styleRectangle9: {
        position:"absolute",
        left: 1542,
        top: 82,
        width: 126,
        height: 62,
    },

    styleRectangle11: {
        position:"absolute",
        left: 1183,
        top: 81,
        width: 201,
        height: 62,
    },

    styleRectangle1: {
        position:"absolute",
        left: 0,
        top: 0,
        width: 1728,
        height: 81,
    },

    styleMemeGenerator: {
        position: "absolute",
        left: 46,
        top: 26,
        width: 322,
        color: "rgba(63,165,46,1)",
        fontSize: 32,
        fontFamily: "Rubik",
        fontWeight: 400,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },

    styleRectangle3: {
        position:"absolute",
        left: 1516,
        top: 0,
        width: 212,
        height: 81,
    },

    styleKarni: {
        position: "absolute",
        left: 1594,
        top: 26,
        width: 72,
        color: "rgba(73,141,61,1)",
        fontSize: 24,
        fontFamily: "Rubik",
        fontWeight: 400,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },

    styleRectangle4: {
        position:"absolute",
        left: 551,
        right: 319,
        top: 0,
        bottom: -81,
        width: "auto",
        height: "auto",
    },
    
    styleRectangle2: {
        position:"absolute",
        left: 318,
        top: 0,
        width: 233,
        height: 81,
    },

    styleCreate: {
        position: "absolute",
        left: 385,
        top: 22,
        width: 168,
        color: "rgba(255,255,255,1)",
        fontSize: 32,
        fontFamily: "Rubik",
        fontWeight: 400,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },

    styleDiscover: {
        position: "absolute",
        left: 602,
        top: 26,
        width: 168,
        color: "rgba(76,121,69,1)",
        fontSize: 32,
        fontFamily: "Rubik",
        fontWeight: 400,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },

    styleRectangle8: {
        position:"absolute",
        left: 173,
        top: 144,
        width: 988,
        height: 63,
        borderRadius: 10,
    },

    styleImage8: {
        position: "absolute",
        left: 80,
        top: 144,
        width: 1588,
        height: 939.
    },

    styleFlat550x550075F1: {
        position: "absolute",
        left: 318,
        top: 244,
        width: 762,
        height: 756.
    },

    styleDownloadShare: {
        position: "absolute",
        left: 1212,
        top: 99,
        width: 158,
        color: "rgba(76,121,69,1)",
        fontSize: 20,
        fontFamily: "Rubik",
        fontWeight: 300,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },

    styleSaveDraft: {
        position: "absolute",
        left: 1417,
        top: 98,
        width: 94,
        color: "rgba(214,238,211,1)",
        fontSize: 20,
        fontFamily: "Rubik",
        fontWeight: 300,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },

    stylePost: {
        position: "absolute",
        left: 1582,
        top: 99,
        width: 57,
        color: "rgba(255,255,255,1)",
        fontSize: 20,
        fontFamily: "Rubik",
        fontWeight: 300,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },
});