# DIDIY - Simple singleton dependency injection in Typescript

Make coding easier by having your classes define their own dependencies and make development and testing easier by having a central place where you can change service implementations.

# How to use

Add the `@Injectable` decorator to any class that you want to be a node in the dependency graph. Add `@Inject` to every class field that you want to have a dependency injected into. 

`@Inject` matches the wanted dependency class by name of the field or by the string that was passed through to the decorator as a parameter. This allows you to inject different implementations in different contexts while keeping the class you sre working on the same.

Injection via decorators gets done at the process start, but you can also inject a dependency at a later point directly into the injection context and the injection will wait for you for a while. This is useful if you wish for example to inject a connected and ready db driver or a repository into your services.

Awaiting the async method waitForInjection makes sure that all of your dependencies have been accounted for and that your program can start working.

TODO: fix multiple folders + TS issues
TODO: make example work
TODO: additional examples

TODO: rework to have additional scopes other than singleton
