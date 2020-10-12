import {DatabaseError} from "../../../controllers/errors/databaseError";

describe('DatabaseError controller', () => {

    test('DatabaseError', () => {
        const testDatabaseError = new DatabaseError('Error')

        expect(new DatabaseError('coucou')).toEqual(testDatabaseError)
    })
});
