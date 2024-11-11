import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import { JOB_DEPS, JOB_MWS, type JOB_NAMES } from '../../jobs/constants';
import { useSelector } from 'react-redux';
import { selectors } from 'react-native-in-app-launch';
import type { RootState } from '../../store/configuration';

const JobBox = (props: { jobName: keyof typeof JOB_NAMES }) => {
    const { jobName } = props;

    const jobStatus = useSelector((state: RootState) => selectors.jobStatus(state, jobName));

    const renderJobStatus = () => {
        if (jobStatus === undefined) {
            return <Text style={styles.jobStatusNotStartedText}>Not Started</Text>;
        }
        if (jobStatus === true) {
            return <ActivityIndicator />;
        }

        return <Text style={styles.jobStatusDoneText}>OK</Text>;
    };

    return (
        <View
            style={[
                styles.container,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                    borderColor: mwColors[JOB_MWS[jobName]],
                    opacity: jobStatus === undefined ? 0.3 : 1,
                    backgroundColor: jobStatus === false ? '#e3fac0' : 'white',
                },
            ]}
        >
            <View style={styles.statusContainer}>{renderJobStatus()}</View>
            <Text style={styles.jobNameText}>{`JOB ${jobName}`}</Text>
            <Text style={styles.labelText}>depends on:</Text>
            <Text style={styles.dependedJobsText}>
                {JOB_DEPS[jobName].length === 0 ? '-' : JOB_DEPS[jobName].join(' - ')}
            </Text>
            <Text style={styles.labelText}>using:</Text>
            <Text style={[styles.mwText, { color: mwColors[JOB_MWS[jobName]] }]}>
                {JOB_MWS[jobName] + ' mw'}
            </Text>
        </View>
    );
};

const mwColors: Record<string, string> = {
    listener: '#6816db',
    saga: '#d13617',
};
const width = Dimensions.get('screen').width;
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: width * 0.01,
        borderColor: 'black',
        alignItems: 'center',
        paddingVertical: width * 0.03,
        paddingHorizontal: width * 0.03,
    },
    jobNameText: {
        fontSize: width * 0.05,
        fontWeight: '700',
        marginBottom: width * 0.005,
    },
    labelText: {
        fontSize: width * 0.03,
    },
    dependedJobsText: {
        fontSize: width * 0.035,
        fontWeight: '600',
        marginBottom: width * 0.005,
    },
    mwText: {
        fontSize: width * 0.033,
        fontWeight: '600',
    },
    statusContainer: {
        paddingBottom: width * 0.03,
    },
    jobStatusDoneText: {
        fontSize: width * 0.03,
        fontWeight: '600',
    },
    jobStatusNotStartedText: {
        fontSize: width * 0.03,
        fontWeight: '600',
    },
});

export default JobBox;
