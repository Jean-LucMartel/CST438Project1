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

            <Text style = {styles.title}>{position}</Text>
            <Text style = {styles.title}>{team}</Text>
            <Text style = {styles.title}>{height}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: 300,
        backgroundColor: "#fff",
        borderRadius : 12,
        padding: 16,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    title: {
        fontSize: 16,
        fontWeight: "bold",
    },

    descriptionText: {
        fontSize: 16
    } 

});