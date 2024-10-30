import { StyleSheet, Text, View } from 'react-native';
import { selectors, useInAppLaunch } from 'react-native-in-app-launch';
import { useSelector } from 'react-redux';
import { JOB_NAMES } from '../../jobs/jobNames';

const Launch = () => {
    useInAppLaunch({
        isAnimationComplete: true,
    });

    const jobStatusA = useSelector((state) => selectors.jobStatus(state, JOB_NAMES.A));
    const jobStatusB = useSelector((state) => selectors.jobStatus(state, JOB_NAMES.B));
    const jobStatusC = useSelector((state) => selectors.jobStatus(state, JOB_NAMES.C));
    const jobStatusD = useSelector((state) => selectors.jobStatus(state, JOB_NAMES.D));
    const jobStatusE = useSelector((state) => selectors.jobStatus(state, JOB_NAMES.E));

    return (
        <View style={styles.container}>
            <Text style={getJobStatusStyle(jobStatusA)}>
                {'Job A: ' + getJobStatusText(jobStatusA)}
            </Text>
            <Text style={getJobStatusStyle(jobStatusB)}>
                {'Job B: ' + getJobStatusText(jobStatusB)}
            </Text>
            <Text style={getJobStatusStyle(jobStatusC)}>
                {'Job C: ' + getJobStatusText(jobStatusC)}
            </Text>
            <Text style={getJobStatusStyle(jobStatusD)}>
                {'Job D: ' + getJobStatusText(jobStatusD)}
            </Text>
            <Text style={getJobStatusStyle(jobStatusE)}>
                {'Job E: ' + getJobStatusText(jobStatusE)}
            </Text>
        </View>
    );
};
const getJobStatusText = (status?: boolean) => {
    if (status === true) {
        return 'Pending';
    }
    if (status === false) {
        return 'Done';
    }

    return 'Not started';
};
const getJobStatusStyle = (status?: boolean) => {
    if (status === true) {
        return styles.jobPending;
    }
    if (status === false) {
        return styles.jobDone;
    }

    return styles.jobNotStarted;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jobNotStarted: {
        color: 'grey',
    },
    jobPending: {
        color: 'black',
    },
    jobDone: {
        color: 'green',
    },
});

export default Launch;
