import produce, {
    produce as produce2,
    applyPatches,
    Patch
} from "../dist/immer.js"

interface State {
    readonly num: number
    readonly foo?: string
    bar: string
    readonly baz: {
        readonly x: number
        readonly y: number
    }
    readonly arr: ReadonlyArray<{readonly value: string}>
    readonly arr2: {readonly value: string}[]
}

const state: State = {
    num: 0,
    bar: "foo",
    baz: {
        x: 1,
        y: 2
    },
    arr: [{value: "asdf"}],
    arr2: [{value: "asdf"}]
}

const expectedState: State = {
    num: 1,
    foo: "bar",
    bar: "foo",
    baz: {
        x: 2,
        y: 3
    },
    arr: [{value: "foo"}, {value: "asf"}],
    arr2: [{value: "foo"}, {value: "asf"}]
}

it("can update readonly state via standard api", () => {
    const newState = produce<State>(state, draft => {
        draft.num++
        draft.foo = "bar"
        draft.bar = "foo"
        draft.baz.x++
        draft.baz.y++
        draft.arr[0].value = "foo"
        draft.arr.push({value: "asf"})
        draft.arr2[0].value = "foo"
        draft.arr2.push({value: "asf"})
    })
    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
})

it("can infer state type from recipe function", () => {
    let foo = produce((_: string | number) => {}, 1)
    foo("")

    // When the function type is implicit, the initial state infers the `State` type.
    let bar = produce(_ => {}, 1)
    bar(2)
})

it("can update readonly state via curried api", () => {
    const newState = produce<State>(draft => {
        draft.num++
        draft.foo = "bar"
        draft.bar = "foo"
        draft.baz.x++
        draft.baz.y++
        draft.arr[0].value = "foo"
        draft.arr.push({value: "asf"})
        draft.arr2[0].value = "foo"
        draft.arr2.push({value: "asf"})
    })(state)
    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
})

it("can update use the non-default export", () => {
    const newState = produce2<State>(draft => {
        draft.num++
        draft.foo = "bar"
        draft.bar = "foo"
        draft.baz.x++
        draft.baz.y++
        draft.arr[0].value = "foo"
        draft.arr.push({value: "asf"})
        draft.arr2[0].value = "foo"
        draft.arr2.push({value: "asf"})
    })(state)
    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
})

it("can apply patches", () => {
    let patches: Patch[] = []
    produce(
        {x: 3},
        d => {
            d.x++
        },
        p => {
            patches = p
        }
    )

    expect(applyPatches({}, patches)).toEqual({x: 4})
})

it("works with generic parameters", () => {
    const _ = <T>(array: ReadonlyArray<T>, index: number, elem: T) => {
        return produce(array, draft => {
            draft.push(elem)
            draft.splice(index, 0, elem)
        })
    }
})
