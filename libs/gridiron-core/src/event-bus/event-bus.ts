import {Injectable, OnModuleDestroy} from '@nestjs/common';
import {Type} from '../common';
import {GridIronEvents} from './gridIron-events';
import {Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

export type EventHandler<T extends GridIronEvents> = (event: T) => void;
export type UnsubscribeFn = () => void;

@Injectable()
export class EventBus implements OnModuleDestroy {
    private subscriberMap = new Map<Type<GridIronEvents>, Array<EventHandler<any>>>()
    private eventStream = new Subject<GridIronEvents>()
    private destroy$ = new Subject()

    publish<T extends GridIronEvents>(event: T): void {
        const eventType = (event as any).constructor
        const handlers = this.subscriberMap.get(eventType)
        if (handlers) {
            const length = handlers.length
            for (let i = 0; i < length; i++) {
                handlers[i](event)
            }
        }
        this.eventStream.next(event)
    }

    ofType<T extends GridIronEvents>(type: Type<T>): Observable<T> {
        return this.eventStream.asObservable().pipe(
            takeUntil(this.destroy$),
            filter(e => (e as any).constructor === type)
        ) as Observable<T>
    }

    subscribe<T extends GridIronEvents>(type: Type<T>, handler: EventHandler<T>): UnsubscribeFn {
        const handlers = this.subscriberMap.get(type)
        if (!handlers.includes(handler)) {
            handlers.push(handler)
        }
        this.subscriberMap.set(type, handlers)
        return () => this.subscriberMap.set(type, handlers.filter(h => h !== handler))
    }

    onModuleDestroy(): any {
        this.destroy$.next()
    }
}
