export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }
  
  pagination() {
    let pageNumber = this.searchQuery.page * 1 || 1;
    if (this.searchQuery.page < 0) pageNumber = 1;
    const limit = 5;
    let skip = (pageNumber - 1) * limit;
    this.pageNumber = pageNumber;
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  filter() {
    let filterObj = structuredClone(this.searchQuery);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace();
    filterObj = JSON.parse(filterObj);

    let excludedFields = ["page", "sort", "fields", "search"];
    excludedFields.forEach((val) => {
      delete filterObj[val];
    });

    this.mongooseQuery.find(filterObj);
    return this;
  }

  sort() {
    if (this.searchQuery.sort) {
      let sortedBy = req.query.sort.split(",").join(" ");
      this.mongooseQuery = mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  fields() {
    if (this.searchQuery.fields) {
      let selectedFields = req.query.fields.split(",").join(" ");
      this.mongooseQuery = mongooseQuery.select(selectedFields);
    }
    return this;
  }

  search() {
    if (this.searchQuery.search) {
      this.mongooseQuery = mongooseQuery.find({
        $or: [
          { title: { $regex: searchQuery.search, $options: "i" } },
          { description: { $regex: searchQuery.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}
