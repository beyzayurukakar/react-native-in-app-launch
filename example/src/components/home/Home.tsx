import { StyleSheet, Text, View } from 'react-native';

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.messageText}>You are in!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d0e9f7',
    },
    messageText: {
        fontSize: 25,
        fontWeight: '600',
    },
});

export default Home;
