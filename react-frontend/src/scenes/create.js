import React from "react";
import {Text, Image, View, StyleSheet} from "react-native";



export default function Create(){
    return (
        <>
            <h1>Create</h1>
            <Image style = {ourStyleSheet.styleImage1} source = {{uri: "https://nyc3.digitaloceanspaces.com/sizze-storage/mdia/images/8Vy5x5uX5RBNdOtig8VIgXij.png"}}></Image>
            <View style = {ourStyleSheet.styleRectangle7}> </View>
            <View style = {ourStyleSheet.styleRectangle9}> </View>
            <View style = {ourStyleSheet.styleRectangle11}> </View>
            <View style = {ourStyleSheet.styleRectangle10}> </View>
            <View style = {ourStyleSheet.styleRectangle1}> </View>
            <Text style = {ourStyleSheet.styleMemeGenerator}> Meme Generator </Text>
            <View style = {ourStyleSheet.styleRectangle3}> </View>
            <Text style = {ourStyleSheet.styleKarni}> Karni </Text>
            <View style = {ourStyleSheet.styleRectangle2}> </View>
            <Text style = {ourStyleSheet.styleCreate}> Create </Text>
            <Text style = {ourStyleSheet.styleDiscover}> Discover </Text>
            <View style = {ourStyleSheet.styleRectangle8}> </View>
            <Image style = {ourStyleSheet.styleImage8} source = {{uri: "https://nyc3.digitaloceanspaces.com/sizze-storage/mdia/images/1OC9AYf4A2ctDAml6VJdTe9D.png"}}></Image>
            <Image style = {ourStyleSheet.styleFlat55x550075F1} source = {{uri: "https://nyc3.digitaloceanspaces.com/sizze-storage/mdia/images/wCcAzCp721T5gGzETiGoI.png"}}></Image>
            <Text style = {ourStyleSheet.styleDownloadShare}> Download/Share </Text>
            <Text style = {ourStyleSheet.styleSaveDraft}> Save draft </Text>
            <Text style = {ourStyleSheet.stylePost}> Post </Text>
        </>
    )
}

const ourStyleSheet = StyleSheet.create({
    styleImage1: {
        position:"absolute",
        left: 0,
        top: 81,
        //borderRadius: null,
        width: 1728,
        height: 1036,
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

    styleRectangle10: {
        position:"absolute",
        left: 1384,
        top: 82,
        width: 158,
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

    styleMKarni: {
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
        //borderRadius: null,
        width: 1588,
        height: 939.
    },

    styleFlat550x550075F1: {
        position: "absolute",
        left: 318,
        top: 244,
        //borderRadius: null,
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
        fontWeight: 400,
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
        fontWeight: 400,
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
        fontWeight: 400,
        letterSpacing: 0,
        fontStyle: "normal",
        textAlign: "left",
    },

    /*styleStyleName: {
        position: "relative",
        width: Dimensions.get("window").width,
        height: 117,
        backgroundColor: "rgba(255,255,255,1)",
    },*/
});