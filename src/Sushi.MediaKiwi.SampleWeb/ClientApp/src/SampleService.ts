import { type IConnector } from "./IConnector";
import { injectable, inject } from "tsyringe";

@injectable()
export class SampleService {
  constructor(@inject("IConnector") private connector: IConnector) {}

  doWork() {
    console.log(this.connector.getItems());
  }
}
