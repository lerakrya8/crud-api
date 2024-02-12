// export class Mutex {

//     private _queue: {
//         resolve: (release: ReleaseFunction) => void;
//     }[] = [];

//     private _isLocked = false;

//     acquire() {
//         return new Promise<ReleaseFunction>((resolve) => {
//             this._queue.push({resolve});
//             this._dispatch();
//         });
//     }

//     async runExclusive<T>(callback: () => Promise<T>) {
//         const release = await this.acquire();
//         try {
//             return await callback();
//         } finally {
//             release();
//         }
//     }

//     private _dispatch() {
//         if (this._isLocked) {
//             return;
//         }
//         const nextEntry = this._queue.shift();
//         if (!nextEntry) {
//             return;
//         }

//         this._isLocked = true; 

//         nextEntry.resolve(this._buildRelease());
//     }

//     private _buildRelease(): ReleaseFunction {
//         return () => {
//             this._isLocked = false;
//             this._dispatch();
//         };
//     }
// }


export class Mutex {

    private _queue: Array<{resolve: () => void, reject: () => void}> = [];  
    private _isLocked = false;

    lock():Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._isLocked) {
                this._queue.push({resolve, reject});
            } else {
                this._isLocked = true;
                resolve();
            }
        });
    }

    release(): void {
        if (this._queue.length > 0) {
            const item = this._queue.shift();
            item?.resolve();
        } else {
            this._isLocked = false;
        }
    }
}

// type ReleaseFunction = () => void;
