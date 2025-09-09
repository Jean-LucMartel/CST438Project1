import {Modal, View, Text, Pressable, StyleSheet, Image} from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    imageURL: string;
    title: string;
    birth_country: string;
    position: string;
    bats: string;
    team: string;
    throws: string;
};

const PlayerDetails: React.FC<Props> = ({visible, onClose, title, birth_country, position, bats, team, throws, imageURL}) => {
    return(
        <Modal
            visible = {visible}
            animationType = "fade"
            transparent
            onRequestClose = {onClose}
        >
            <View style = {styles.modalBackground}>
                <View style = {styles.modalContent}>
                    <Image source = {{uri: imageURL}} style = {styles.image}></Image>     
                    <Text style = {styles.modalTitle}>{title}</Text>
                    <Text>{team}</Text>
                    <Text>{birth_country}</Text>
                    <Text>{position}</Text>
                    <Text>{bats}</Text>
                    <Text>{throws}</Text>
                    <Pressable style = {styles.closeButton} onPress = {onClose}>
                        <Text style = {styles.buttonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        width: "80%",
        alignItems: "center",
    },

    modalTitle: {
        fontSize: 20,
        marginBottom: 10
    },

    closeButton: {
        marginTop: 20,
        backgroundColor: '#fa5c5c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        
    },

    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },

    buttonText: {
        color: "white"
    }


});

export default PlayerDetails;
