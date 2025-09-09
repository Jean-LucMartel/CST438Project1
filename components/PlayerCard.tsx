import React, {useState} from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import PlayerDetails from "@/components/PlayerDetails";

type Props = {
    title: string;
    position: string;
    team: string;
    height: string;
};

export default function PlayerCard({title, position, team, height} : Props) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        
        <View style = {styles.cardContainer}>
            <Pressable style = {styles.cardContainer} onPress = {() => setModalVisible(true)}>             
                <Text style = {styles.title}>{title}</Text>
                <Text style = {styles.descriptionText}>{position}</Text>
                <Text style = {styles.descriptionText}>{team}</Text>
                <Text style = {styles.descriptionText}>{height}</Text>
            </Pressable>

            <PlayerDetails
                visible = {modalVisible}
                onClose = {() => setModalVisible(false)}
                title = {title}
                position = {position}
                imageURL = "data:image/jpeg;base64,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"
                birth_country = "United States"
                bats = "LR"
                throws = "R"
                team = "Dodgers"
            ></PlayerDetails>
            
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 16,
        fontWeight: "bold",
    },

    descriptionText: {
        fontSize: 16

    } 

});