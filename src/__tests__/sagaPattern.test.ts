import { getSagaPattern } from '../tools';
import { slice } from '../store/slice';

describe('getSagaPattern', () => {
    it('matches job ending action', () => {
        const jobName = 'a';
        const action = slice.actions.setJobStatus({
            jobName,
            status: false,
        });
        expect(getSagaPattern(jobName)(action)).toBe(true);
    });
    it('does not match job starting action', () => {
        const jobName = 'a';
        const action = slice.actions.setJobStatus({
            jobName,
            status: true,
        });
        expect(getSagaPattern(jobName)(action)).toBe(false);
    });
    it('does not match job ending action of another job', () => {
        const jobName = 'a';
        const anotherJobName = 'b';

        const action = slice.actions.setJobStatus({
            jobName,
            status: false,
        });
        expect(getSagaPattern(anotherJobName)(action)).toBe(false);
    });
});
