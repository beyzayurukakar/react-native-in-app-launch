import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useManageLaunch } from 'react-native-in-app-launch';
import JobBox from './JobBox';

const Launch = () => {
    useManageLaunch({
        isAnimationComplete: true,
    });

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>React Native In-App Launch Demo</Text>
            <View style={styles.jobStatusListContainer}>
                <JobBox jobName="A" />
                <JobBox jobName="B" />
                <JobBox jobName="C" />
                <JobBox jobName="D" />
            </View>
            <View style={styles.jobStatusListContainer}>
                <JobBox jobName="E" />
                <JobBox jobName="F" />
                <JobBox jobName="G" />
            </View>
        </View>
    );
};

const width = Dimensions.get('screen').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.01,
    },
    titleText: {
        fontWeight: '900',
        marginBottom: width * 0.1,
        fontSize: width * 0.06,
        textAlign: 'center',
    },
    jobStatusListContainer: {
        flexDirection: 'row',
        gap: width * 0.025,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: width * 0.1,
    },
});

export default Launch;
