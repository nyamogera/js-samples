
module greeting {
	export class Hello {
		constructor(private text: string) {
		}
		say(): void {
			console.log(this.text);
		}
	}
}

let hello: greeting.Hello = new greeting.Hello("Hello, world!");
hello.say();