import {Observable, Observer} from 'rxjs';

export function asyncObservable<T>(work: (observer: Observer<T>) => Promise<T | void>): Observable<T> {
    return new Observable<T>(subscriber => {
        (async () => {
            try {
                const result = await work(subscriber)
                if (result) {
                    subscriber.next(result)
                }
                subscriber.complete()
            } catch (e) {
                subscriber.error(e)
            }
        })()
    })
}
