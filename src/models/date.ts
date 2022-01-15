export default class DateHandler{

    getCurrentGDate(){
        const d = new Date() as any;
        let stringDate =  (d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
        return this.reverseDateParts(stringDate);
    }

    private reverseDateParts(string: string) : string{
        const dateArray = string.split('/');
        dateArray.reverse();
        return dateArray.join('/');
    }
}