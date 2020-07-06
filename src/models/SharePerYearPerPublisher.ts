export class SharePerYearPerPublisher{
    constructor(year:number, share:number, publisher:String){
        this.year = year;
        this.share = share;
        this.publisher = publisher;
    }

    year: number;
    share: number;
    publisher: String;
}