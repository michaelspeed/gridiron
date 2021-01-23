import {Injectable} from '@nestjs/common';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, takeWhile, tap} from 'rxjs/operators';
import {Logger} from '../config';

@Injectable()
export class WorkerMonitor {
    openTasks = new BehaviorSubject<number>(0)
    get openTaskCount(): number {
        return  this.openTasks.value
    }
    increment() {
        this.openTasks.next(this.openTasks.value + 1)
    }
    decrement() {
        this.openTasks.next(this.openTasks.value - 1)
    }
    waitForOpenTaskToComplete(): Promise<number> {
        if (0 < this.openTaskCount) {
            Logger.info("Waiting for open task to Complete")
        }
        return this.openTasks.asObservable().pipe(
            tap(count => {
                if (0 < count) {
                    Logger.info(`${count} task Open`)
                }
            }),
            debounceTime(100),
            takeWhile(value => value > 0)
        ).toPromise()
    }
}
