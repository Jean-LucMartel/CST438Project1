import {View, Text, StyleSheet} from "react-native"

type Props = {
    title: String;
    position: String;
    team: String;
    height: String;
};

export default function PlayerCard({title, position, team, height} : Props) {
    return (
        
        <View style = {styles.cardContainer}>
            <Text style = {styles.title}>{title}</Text>

            <Text style = {styles.descriptionText}>{position}</Text>
            <Text style = {styles.descriptionText}>{team}</Text>
            <Text style = {styles.descriptionText}>{height}</Text>
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