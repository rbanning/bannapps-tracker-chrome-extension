import { __awaiter } from "tslib";
export class PopupComponent {
    run() {
        document.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.SayHello('Rob');
            console.log("DEBUG: say hello", result);
        }));
    }
    SayHello(name = 'Jane') {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                window.setTimeout(() => {
                    resolve(`Hello ${name || 'unknown'}!  Glad you made it PAL`);
                }, 2000);
            });
        });
    }
}
const pop = new PopupComponent();
pop.run();
