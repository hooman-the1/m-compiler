export default class DateHandler {
    getCurrentGDate() {
        const d = new Date();
        let stringDate = (d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
        return this.reverseDateParts(stringDate);
    }
    reverseDateParts(string) {
        const dateArray = string.split('/');
        dateArray.reverse();
        return dateArray.join('/');
    }
}
