import chai from "chai";
import { Event } from "ethers";

declare global {
  export namespace Chai {
    // eslint-disable-next-line no-unused-vars
    interface Assertion {
      emitted(eventName: string): void;
      emittedWithArgs(
        eventName: string,
        args: { [key: string]: any } | any[]
      ): void;
    }
  }
}

chai.use(function (chai) {
  const Assertion = chai.Assertion;

  Assertion.addMethod("emitted", function (eventName: string) {
    const obj = this._obj;

    new Assertion(obj.events).to.be.an("array");

    this.assert(
      obj.events.some((event: Event) => event.event === eventName),
      `expected #{this} to have emitted #{exp} event`,
      `expected #{this} to not have emitted #{exp} event`,
      eventName
    );
  });
});

chai.use(function (chai) {
  const Assertion = chai.Assertion;

  Assertion.addMethod(
    "emittedWithArgs",
    function (eventName: string, args: { [key: string]: any } | []) {
      const obj = this._obj;

      new Assertion(obj).to.have.emitted(eventName);

      const foundEvent = obj.events.find(
        (event: Event) => event.event === eventName
      );

      const isEmittedWithGivenArgs = Object.entries(args).every(
        ([arg, value]) => {
          if (foundEvent.args[arg]?._isBigNumber) {
            return foundEvent.args[arg].eq(value);
          }

          return foundEvent.args[arg] === value;
        }
      );

      this.assert(
        isEmittedWithGivenArgs,
        `expected #{this} to have emitted ${eventName} with #{exp} args but got #{act} args`,
        `expected #{this} to not have emitted ${eventName} with #{exp} args but got #{act} args`,
        args,
        foundEvent.args
      );
    }
  );
});
