export const JOB_NAMES = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
};

export const JOB_DEPS = {
    A: [],
    B: [JOB_NAMES.A],
    C: [],
    D: [JOB_NAMES.A, JOB_NAMES.C],
    E: [],
    F: [JOB_NAMES.E],
    G: [JOB_NAMES.B, JOB_NAMES.F],
};

export const JOB_MWS = {
    A: 'listener',
    B: 'listener',
    C: 'listener',
    D: 'listener',
    E: 'saga',
    F: 'saga',
    G: 'saga',
};
