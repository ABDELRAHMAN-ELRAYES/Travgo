import { Query } from "mongoose";

export class APIFeatures {
  public query: Query<any, any>;
  public queryString: any;

  constructor(query: Query<any, any>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }
  public filter(): this {
    if (this.queryString) {
      const nonValidFilterProps = ["limit", "page", "sort", "fields"];
      const queryStringCopy = { ...this.queryString };

      nonValidFilterProps.forEach((element) => delete queryStringCopy[element]);

      const query = JSON.parse(
        JSON.stringify(queryStringCopy).replace(
          /\b(gte|lte|gt|lt)\b/g,
          (match) => `$${match}`
        )
      );
      this.query = this.query.find(query);
    }
    return this;
  }
  public sort(): this {
    if (this.queryString.sort) {
      let sortingProps = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortingProps);
    }
    return this;
  }
}
