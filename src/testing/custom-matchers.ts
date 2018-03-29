export const customMatchers = {
    toHaveBeenCalledWithAll: function (util, customEqualityTesters) {
        return {
        compare: function(actual, expected) {
            const result = {
            pass: false,
            message: ''
            };

            const j$ = window['jasmine'];
            const getErrorMsg = j$.formatErrorMsg('<toHaveBeenCalledWithAll>', 'expect(<spyObj>).toHaveBeenCalledWith(...arguments)');

            if (!j$.isSpy(actual)) {
            throw new Error(getErrorMsg(`Expected a spy, but got ${j$.pp(actual)}.`));
            }

            if (!actual.calls.any()) {
            result.message = `Expected spy ${actual.and.identity()} to have been called with ${j$.pp(expected)}, but it was never called.`;
            }

            if (util.equals(actual.calls.allArgs(), expected)) {
            result.pass = true;
            } else {
            result.message =
                `Expected spy ${actual.and.identity()} to have been called with ${expected}, but actual calls were ${actual.calls.allArgs()}`;
            }

            return result;
        }
        };
    }
};
