export class SharePerYearPerPublisher{
    constructor(year:number, share:number, publisher:String){
        this.year = year;
        this.share = share;
        this.publisher = publisher;
    }

    year: Number;
    share: Number;
    publisher: String;
}