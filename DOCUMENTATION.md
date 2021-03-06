## Table of Contents
- [Usage](#usage-)
- [Cards](#cards-)
  - [`Cards.byId (id: string): Promise<Card>;`](#cardsbyid-id-string-promisecard-)
  - [`Cards.byName (name: string, set?: string, fuzzy = false): Promise<Card>;`](#cardsbyname-name-string-set-string-fuzzy--false-promisecard-)
  - [`Cards.bySet (code: string, collectorId: number, lang?: string): Promise<Card>;`](#cardsbyset-setcode-string-collectorid-number-lang-string-promisecard-)
  - [`Cards.byMultiverseId (id: number): Promise<Card>;` ](#cardsbymultiverseid-id-number-promisecard-)
  - [`Cards.byMtgoId (id: number): Promise<Card>;` ](#cardsbymtgoid-id-number-promisecard-)
  - [`Cards.byArenaId (id: number): Promise<Card>;` ](#cardsbyarenaid-id-number-promisecard-)
  - [`Cards.byTcgPlayerId (id: number): Promise<Card>;` ](#cardsbytcgplayerid-id-number-promisecard-)
  - [`Cards.search (query: string, options?: SearchOptions): MagicEmitter<Card>;` ](#cardssearch-query-string-options-searchoptions-magicemittercard-)
  - [`Cards.all (page = 1): MagicEmitter<Card>;` ](#cardsall-page--1-magicemittercard-)
  - [`Cards.random (id: number): Promise<Card>;` ](#cardsrandom-id-number-promisecard-)
  - [`Cards.autoCompleteName (name: string): Promise<string[]>;` ](#cardsautocompletename-name-string-promisestring-)
  - [`Cards.collection (...collection: CardIdentifier[]): MagicEmitter<Card>;`](#cardscollection-collection-cardidentifier-magicemittercard-)
- [Sets](#sets-)
  - [`Sets.byCode (code: string): Promise<Set>;` ](#setsbycode-code-string-promiseset-)
  - [`Sets.byId (id: string): Promise<Set>;` ](#setsbyid-id-string-promiseset-)
  - [`Sets.byTcgPlayerId (id: number): Promise<Set>;` ](#setsbytcgplayerid-id-number-promiseset-)
  - [`Sets.all (): Promise<Set[]>;` ](#setsall--promiseset-)
- [Rulings](#rulings-)
  - [`Rulings.byId (id: string): Promise<Ruling[]>;` ](#rulingsbyid-id-string-promiseruling-)
  - [`Rulings.bySet (code: string, collectorId: string | number): Promise<Ruling[]>;` ](#rulingsbyset-code-string-collectorid-string-number-promiseruling-)
  - [`Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` ](#rulingsbymultiverseid-id-number-promiseruling-)
  - [`Rulings.byMtgoId (id: number): Promise<Ruling[]>;` ](#rulingsbymtgoid-id-number-promiseruling-)
  - [`Rulings.byArenaId (id: number): Promise<Ruling[]>;` ](#rulingsbyarenaid-id-number-promiseruling-)
- [Symbology](#symbology-)
  - [`Symbology.all (): Promise<CardSymbol[]>;`](#symbologyall--promisecardsymbol-)
  - [`Symbology.parseMana (mana: string): Promise<ManaCost>;` ](#symbologyparsemana-mana-string-promisemanacost-)
- [Catalogs](#catalogs-)
  - [`Catalog.cardNames (): Promise<string[]>;` ](#catalogcardnames--promisestring-)
  - [`Catalog.artistNames (): Promise<string[]>;` ](#catalogartistnames--promisestring-)
  - [`Catalog.wordBank (): Promise<string[]>;`](#catalogwordbank--promisestring-)
  - [`Catalog.creatureTypes (): Promise<string[]>;`  ](#catalogcreaturetypes--promisestring-)
  - [`Catalog.planeswalkerTypes (): Promise<string[]>;` ](#catalogplaneswalkertypes--promisestring-)
  - [`Catalog.landTypes (): Promise<string[]>;`](#cataloglandtypes--promisestring-)
  - [`Catalog.artifactTypes (): Promise<string[]>;` ](#catalogartifacttypes--promisestring-)
  - [`Catalog.enchantmentTypes (): Promise<string[]>;` ](#catalogenchantmenttypes--promisestring-)
  - [`Catalog.spellTypes (): Promise<string[]>;` ](#catalogspelltypes--promisestring-)
  - [`Catalog.powers (): Promise<string[]>;` ](#catalogpowers--promisestring-)
  - [`Catalog.toughnesses (): Promise<string[]>;`](#catalogtoughnesses--promisestring-)
  - [`Catalog.loyalties (): Promise<string[]>;`  ](#catalogloyalties--promisestring-)
  - [`Catalog.watermarks (): Promise<string[]>;` ](#catalogwatermarks--promisestring-)
- [Bulk Data](#bulk-data-)
  - [`BulkData.downloadByType (type: BulkDataType): Promise<Stream | undefined>;`](#bulkdatadownloadbytype-type-bulkdatatype-promisestream--undefined-)
  - [`BulkData.downloadById (id: string): Promise<Stream | undefined>;`](#bulkdatadownloadbyid-id-string-promisestream--undefined-)
  - [`BulkData.definitions (): Promise<BulkDataDefinition[]>;`](#bulkdatadefinitions--promisebulkdatadefinition-)
  - [`BulkData.definitionByType (type: BulkDataType): Promise<BulkDataDefinition>;`](#bulkdatadefinitionbytype-type-bulkdatatype-promisebulkdatadefinition-)
  - [`BulkData.definitionById (id: string): Promise<BulkDataDefinition>;`](#bulkdatadefinitionbyid-id-string-promisebulkdatadefinition-)
- [Misc](#misc-)
  - [`homepageLinks (): Promise<string[]>;`](#homepagelinks--promisestring-)
  - [`error (): SearchError | undefined;`](#error--searcherror--undefined-)
  - [`setRetry (attempts: number, timeout?: number, canRetry?: (error: SearchError) => boolean): void;`](#setretry-attempts-number-timeout-number-canretry-error-searcherror--boolean-void-)
  - [`MagicEmitter<T, NOT_FOUND>`](#magicemittert-not_found-)



## Usage [🡅](#table-of-contents)

In the documentation below, requiring the package is assumed.
```ts
import Scry = require("scryfall-sdk");
```



## Cards [🡅](#table-of-contents)

### `Cards.byId (id: string): Promise<Card>;` [🡅](#table-of-contents)

Gets a single card from its ID.

```ts
Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050").then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byName (name: string, set?: string, fuzzy = false): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its name. Supports fuzzy searching, by 1-2 replacements/translations.

```ts
Scry.Cards.byName("Blood Scrivener").then(result => console.log(result.name)); // Blood Scrivener
Scry.Cards.byName("Bliid Scrivener", true).then(result => console.log(result.name)); // Blood Scrivener
Scry.Cards.byName("Loxodon Warhammer", "MRD").then(result => console.log(result.name, result.set)); // Loxodon Warhammer, mrd
Scry.Cards.byName("Warhammer", "MRD", true).then(result => console.log(result.name, result.set)); // Loxodon Warhammer, mrd
```

### `Cards.bySet (setCode: string, collectorNumber: number, lang?: string): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its set and collector id. You can use the optional `lang` argument to get cards in another language. See the [Scryfall Documentation for a list of all languages](https://scryfall.com/docs/api/languages).

```ts
Scry.Cards.bySet("dgm", 22).then(result => console.log(result.name + ", " + result.printed_name)); // Blood Scrivener, undefined
Scry.Cards.bySet("dgm", 22, "ja").then(result => console.log(result.name + ", " + result.printed_name)); // Blood Scrivener, 血の公証人
```

### `Cards.byMultiverseId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its multiverse id.

```ts
Scry.Cards.byMultiverseId(369030).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byMtgoId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its MTGO (sometimes called "Cat") id.

```ts
Scry.Cards.byMtgoId(48338).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byArenaId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its MTG Arena id.

```ts
Scry.Cards.byArenaId(67330).then(result => console.log(result.name)); // Yargle, Glutton of Urborg
```

### `Cards.byTcgPlayerId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its TCG Player id.

```ts
Scry.Cards.byTcgPlayerId(1030).then(result => console.log(result.name)); // Ankh of Mishra
```

### `Cards.search (query: string, options?: SearchOptions | number): MagicEmitter<Card>;` [🡅](#table-of-contents)

Queries for a card using the [Scryfall Search API](https://scryfall.com/docs/reference).

```ts
Scry.Cards.search("type:planeswalker").on("data", card => {
	console.log(card.name);
}).on("end", () => {
	console.log("done");
});
```

For information on how to provide extra options, see the [`/get/cards/search` page](https://scryfall.com/docs/api/cards/search) on Scryfall. You can also reference the `SearchOptions` interface in [`Cards.ts`](./src/api/Cards.ts)

This query returns a [`MagicEmitter`](#magicemittert-).

The page parameter is the page of results that the query will begin at. A page is 175 cards, and cannot be changed. To get only the one page you requested, you can do the following:

```ts
const cardsFromPage15 = await Scry.Cards.search("type:creature", 15).cancelAfterPage().waitForAll();
```

### `Cards.random (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a random card.

```ts
Scry.Cards.random().then(result => console.log(result.name));
```

### `Cards.autoCompleteName (name: string): Promise<string[]>;` [🡅](#table-of-contents)

From the [Scryfall documentation](https://scryfall.com/docs/api/cards/autocomplete):

Returns [an array] containing up to 25 full card names that could be autocompletions of the given string parameter q.

This method is designed for creating assistive UI elements that allow users to free-type card names.
The names are sorted with the nearest match first.

Spaces, punctuation, and capitalization are ignored.

If q is less than 2 characters long, or if no names match, the Catalog will contain 0 items (instead of returning any errors).

```ts
Scry.Cards.autoCompleteName("bloodsc").then((results) => {
	for (const result of results) {
		console.log(result);
		// Bloodscent
		// Blood Scrivener
		// Bloodscale Prowler
		// Burning-Tree Bloodscale
		// Ghor-Clan Bloodscale
	}
});
```

### `Cards.collection (...collection: CardIdentifier[]): MagicEmitter<Card>;` [🡅](#table-of-contents)

Takes a list of "card identifiers", which describe a card, and returns their actual card objects.

This method is useful for decks and even entire collections. Scryfall has a limit of 75 cards, but this API will split your request into multiple API calls, allowing requests of *as many cards as you want*.

In order to assist with manual requests, this method comes with a new set of factories by the name `CardIdentifier`. These are:
- `Scry.CardIdentifier.byId(id: string): CardIdentifier;`
- `Scry.CardIdentifier.byMultiverseId(id: number): CardIdentifier;`
- `Scry.CardIdentifier.byMtgoId(id: number): CardIdentifier;`
- `Scry.CardIdentifier.byOracleId(id: string): CardIdentifier;`
- `Scry.CardIdentifier.byIllustrationId(id: string): CardIdentifier;`
- `Scry.CardIdentifier.byName(string: string, set?: string): CardIdentifier;`
- `Scry.CardIdentifier.byName(string: string, set?: string): CardIdentifier;`
- `Scry.CardIdentifier.bySet(set: string, collectorNumber: string | number): CardIdentifier;`

Example:
```ts
const collection = [
    Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-6c09921c0075"),
    Scry.CardIdentifier.byMultiverseId(462293),
    Scry.CardIdentifier.byMtgoId(71692),
    Scry.CardIdentifier.byOracleId("394c6de5-7957-4a0b-a6b9-ee0c707cd022"),
    Scry.CardIdentifier.byIllustrationId("99f43949-049e-41e2-bf4c-e22e11790012"),
    Scry.CardIdentifier.byName("Blood Scrivener"),
    Scry.CardIdentifier.byName("Lightning Bolt", "prm"),
    Scry.CardIdentifier.bySet("mrd", "150"),
];

const cards = await Scry.Cards.collection(...collection).waitForAll();
// every card identifier has been mapped to its real card object

for (const card of cards) {
    console.log(card.name);
}
// Crush Dissent
// Contentious Plan
// Bond of Insight
// Forgotten Cave
// GO TO JAIL
// Blood Scrivener
// Lightning Bolt
// Chalice of the Void
```



## Sets [🡅](#table-of-contents)

### `Sets.byCode (code: string): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its code.

```ts
Scry.Sets.byCode("hou").then(set => console.log(set.name)); // Hour of Devastation
```

### `Sets.byId (id: string): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its Scryfall ID.

```ts
Scry.Sets.byId("65ff168b-bb94-47a5-a8f9-4ec6c213e768").then(set => console.log(set.name)); // Hour of Devastation
```

### `Sets.byTcgPlayerId (id: number): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its TCG Player ID, also known as the `groupId` on [TCGPlayer's API](https://docs.tcgplayer.com/docs).

```ts
Scry.Sets.byTcgPlayerId(1934).then(set => console.log(set.name)); // Hour of Devastation
```

### `Sets.all (): Promise<Set[]>;` [🡅](#table-of-contents)

Gets all sets.

```ts
Scry.Sets.all().then(result => console.log(result.length)); // 394
```



## Rulings [🡅](#table-of-contents)

### `Rulings.byId (id: string): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a single card from its ID.

```ts
Scry.Rulings.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050").then(result => console.log(result.length)); // 2
```

### `Rulings.bySet (code: string, collectorId: string | number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its set and collector id.

```ts
Scry.Rulings.bySet("dgm", "22").then(result => console.log(result.length)); // 2
```

### `Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its multiverse id.

```ts
Scry.Rulings.byMultiverseId(369030).then(result => console.log(result.length)); // 2
```

### `Rulings.byMtgoId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its MTGO (sometimes called "Cat") id.

```ts
Scry.Rulings.byMtgoId(48338).then(result => console.log(result.length)); // 2
```

### `Rulings.byArenaId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its Arena id.

```ts
Scry.Rulings.byArenaId(67204).then(result => console.log(result.length)); // 3
```


## Symbology [🡅](#table-of-contents)

### `Symbology.all (): Promise<CardSymbol[]>;` [🡅](#table-of-contents)

Gets all [card symbols](https://scryfall.com/docs/api/card-symbols).

```ts
Scry.Symbology.all().then(result => console.log(result.length)); // 63
```

### `Symbology.parseMana (mana: string): Promise<ManaCost>;` [🡅](#table-of-contents)

From the [Scryfall documentation](https://scryfall.com/docs/api/card-symbols/parse-mana):

Parses the given mana cost parameter and returns Scryfall’s interpretation.

The server understands most community shorthand for mana costs (such as `2WW` for `{2}{W}{W}`). Symbols can also be out of order, lowercase, or have multiple colorless costs (such as `2{g}2` for `{4}{G}`).

```ts
Scry.Symbology.parseMana("7wg").then(result => console.log(result.cost)); // {7}{W}{G}
```


## Catalogs [🡅](#table-of-contents)

### `Catalog.cardNames (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.cardNames().then(result => console.log(result.length)); // 18059
```

### `Catalog.artistNames (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.artistNames().then(result => console.log(result.length)); // 676
```

### `Catalog.wordBank (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.wordBank().then(result => console.log(result.length)); // 12892
```

### `Catalog.creatureTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.creatureTypes().then(result => console.log(result.length)); // 242
```

### `Catalog.planeswalkerTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.planeswalkerTypes().then(result => console.log(result.length)); // 42
```

### `Catalog.landTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.landTypes().then(result => console.log(result.length)); // 13
```

### `Catalog.artifactTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.artifactTypes().then(result => console.log(result.length)); // 6
```

### `Catalog.enchantmentTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.enchantmentTypes().then(result => console.log(result.length)); // 5
```

### `Catalog.spellTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.spellTypes().then(result => console.log(result.length)); // 2
```

### `Catalog.powers (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.powers().then(result => console.log(result.length)); // 33
```

### `Catalog.toughnesses (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.toughnesses().then(result => console.log(result.length)); // 35
```

### `Catalog.loyalties (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.loyalties().then(result => console.log(result.length)); // 9
```

### `Catalog.watermarks (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.watermarks().then(result => console.log(result.length)); // 50
```


## Bulk Data [🡅](#table-of-contents)

### `BulkData.downloadByType (type: BulkDataType): Promise<Stream | undefined>;` [🡅](#table-of-contents)
Returns a stream for a bulk data file by its type, or `undefined` if the bulk data file hasn't been updated since the last download time.

```ts
/**
 * if you're downloading the file from scryfall and storing it on disk, usually you'll want to get the file modification date here.
 * if you want to redownload the file regardless of the last time it was updated, just put `0` here.
 */
const lastDownloadTime: number;
Scry.BulkData.downloadByType("rulings", lastDownloadTime).then(result => console.log(result)); // either a stream or undefined
```

Example with saving the file to disk, assuming the usage of a promisified fs module:
```ts
// redownload rulings.json if it's been updated since the last download
const rulingsJsonStats = await fs.stat("rulings.json");
const rulingsStream = await Scry.BulkData.downloadByType("rulings", rulingsJsonStats.mtimeMs);
if (rulingsStream)
    rulingsStream.pipe(fs.createWriteStream("rulings.json"));
```

### `BulkData.downloadById (id: string): Promise<Stream | undefined>;` [🡅](#table-of-contents)
Returns a stream for a bulk data file by its id, or `undefined` if the bulk data file hasn't been updated since the last download time.

```ts
const id = "<an id here>"; // a UUID identifying the bulk data definition
Scry.BulkData.downloadById(id, lastDownloadTime).then(result => console.log(result)); // either a stream or undefined
```

### `BulkData.definitions (): Promise<BulkDataDefinition[]>;` [🡅](#table-of-contents)
Returns the definitions of all bulk data files that Scryfall is currently providing.

```ts
Scry.BulkData.definitions().then(result => console.log(result.length)); // 5
```

### `BulkData.definitionByType (type: BulkDataType): Promise<BulkDataDefinition>;` [🡅](#table-of-contents)
Returns a single bulk data file definition by its type.

```ts
Scry.BulkData.definitionByType("rulings").then(result => console.log(result.object, result.type)); // "bulk_data rulings"
```

### `BulkData.definitionById (id: string): Promise<BulkDataDefinition>;` [🡅](#table-of-contents)
Returns a single bulk data file definition by its id.

```ts
const id = "<an id here>"; // a UUID identifying the bulk data definition
Scry.BulkData.definitionById(id).then(result => console.log(result.object, result.type)); // "bulk_data rulings"
```


## Misc [🡅](#table-of-contents)

### `homepageLinks (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Misc.homepageLinks().then(result => console.log(result.length)); // 4
```


### `error (): SearchError | undefined;` [🡅](#table-of-contents)

Returns the error returned by the last API call, or undefined if there was no error.

Note: The "last error" is reset for every page in a multi-page call — this means that using `.waitForAll()` or similar may throw out errors from previous pages.


### `setRetry (attempts: number, timeout?: number, canRetry?: (error: SearchError) => boolean): void;` [🡅](#table-of-contents)

Sets the retry attempts & timeout for future API calls.

If a call errors because of a 404 or 400 (not found/bad request), then it will not retry.

Example usage:
```ts
// allow 3 attempts for each query, with a timeout of 1000 ms (1 sec) between each
Scry.setRetry(3, 1000);
// some api requests here

// allow 3 attempts, a timeout of 1000 ms, and only retry if the error code is "some_code"
Scry.setRetry(3, 1000, error => error.code == "some_code");
// some api requests here
```


### `MagicEmitter<T, NOT_FOUND>` [🡅](#table-of-contents)

### `MagicEmitter.on(event: "data", listener: (data: T) => any): MagicEmitter;`

Adds a listener for when data has been received. This method returns the emitter object.

### `MagicEmitter.on(event: "not_found", listener: (notFound: NOT_FOUND) => any): MagicEmitter;`

Adds a listener for when the API returned that it was unable to find something. This method returns the emitter object.

### `MagicEmitter.on(event: "end", listener: () => any): MagicEmitter;`

Adds a listener for when all data has been received. This method returns the emitter object.

### `MagicEmitter.on(event: "cancel", listener: () => any): MagicEmitter;`

Adds a listener for when emitting data has been cancelled. This method returns the emitter object.

### `MagicEmitter.on(event: "error", listener: (err: Error) => any): MagicEmitter;`

Adds a listener for when the emitter errors. This method returns the emitter object.

### `MagicEmitter.on(event: "done", listener: () => any): MagicEmitter;`

Adds a listener for when the emitter is done: either after finishing, erroring, or being cancelled. This method returns the emitter object.

### `MagicEmitter.cancel(): void;`

Cancels emitting data. Only emits the `"cancel"` event, not the `"end"` event.

### `MagicEmitter.waitForAll(): Promise<T[] & { not_found: NOT_FOUND[] }>;`

Returns a promise for an array of `T`, fulfilled after the end event is emitted. If the API returns that it was unable to find anything, it's returned in a `not_found` array property on the array of `T`. (Note that this property is excluded when using `JSON.stringify` on the array)

### `MagicEmitter.all(): AsyncGenerator<T, void, unknown>;`

Returns an async iterator that will yield each T when it receives it.

Example usage:

```ts
for await (const card of Scry.Cards.search("type:planeswalker").all()) {
    console.log(card.name);
}
```

### `MagicEmitter.notFound(): AsyncGenerator<NOT_FOUND, void, unknown>;`

Returns an async generator that will yield each "not found" value when it receives it.

Example usage:

```ts
for await (const identifier of Scry.Cards.collection({ id: "00000000-0000-0000-0000-000000000000" }).notFound()) {
    console.log(identifier);
}
```
