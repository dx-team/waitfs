const wait = require('../src');
const sinon = require('sinon');
const fs = require('fs');


test('waitfs timeout', async () => {
    const timeoutSpy = sinon.spy();
    const okSpy = sinon.spy();
    wait.forCreate('./_ignore_.txt', 250)
        .then(ok => {
            if (!ok) timeoutSpy(ok);
            else {
                okSpy(ok);
            }
        })
        .then(ok => {
            sinon.assert.called(timeoutSpy);
            sinon.assert.notCalled(okSpy);
        });

    const resp = await wait.forCreate('./_ignore_.txt', 500);

    expect(resp).toBe(false);
});

test('waitfs create', async () => {
    const okSpy = sinon.spy();
    const deletedSpy = sinon.spy();
    const timeoutSpy = sinon.spy();
    const filename = './_ignore_.txt';

    setTimeout(() => fs.writeFileSync(filename, '123'), 2000);
    setTimeout(() => fs.unlinkSync(filename), 8000);

    wait.forCreate(filename, 12500)
        .then(ok => {
            if (!ok) timeoutSpy(ok);
            else {
                okSpy(ok);
            }
        })
        .then(ok => {
            sinon.assert.called(okSpy);
            sinon.assert.notCalled(timeoutSpy);
        })
        .then(ok => {
            wait.forRemove(filename, 30000)
                .then(deleted => {
                    if (!deleted) timeoutSpy(deleted);
                    else {
                        deletedSpy(deleted);
                    }
                })
                .then(deleted => {
                    sinon.assert.called(deletedSpy);
                    sinon.assert.notCalled(timeoutSpy);
                });
        });
});