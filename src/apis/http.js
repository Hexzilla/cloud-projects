import axios from "axios";

export default axios.create({
  baseURL: "http://35.202.101.5:4299/be/pm",
  headers: {
    "Content-type": "application/json",
    "common": {
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDg2OTQzMjYsImV4cCI6MTYxMzg3ODMyNn0.x8IWPBFTEdoctPVvgPMP9TRp81BdmeDRlHvFczCa-y0",
    }
  }
});

