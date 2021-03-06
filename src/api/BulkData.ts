import Axios from "axios";
import { Stream } from "stream";
import MagicQuerier, { List } from "../util/MagicQuerier";

enum BulkDataTypes {
	oracle_cards,
	unique_artwork,
	default_cards,
	all_cards,
	rulings,
}

export type BulkDataType = keyof typeof BulkDataTypes;

export interface BulkDataDefinition {
	object: "bulk_data";

	id: string;
	type: BulkDataType;
	updated_at: string;
	uri: string;
	name: string;
	description: string;
	compressed_size: number;
	download_uri: string;
	content_type: string;
	content_encoding: string;
}

export default new class BulkData extends MagicQuerier {

	/**
	 * Returns a stream for the given bulk data if it has been updated since the last download time. If it hasn't, returns `undefined`
	 * @param lastDownload The last time this bulk data was downloaded. If you want to re-download the data regardless of
	 * the last time it was downloaded, set this to `0`.
	 */
	public async downloadByType (type: BulkDataType, lastDownload: string | number | Date) {
		return this.download(type, lastDownload);
	}

	/**
	 * Returns a stream for the given bulk data if it has been updated since the last download time. If it hasn't, returns `undefined`
	 * @param lastDownload The last time this bulk data was downloaded. If you want to re-download the data regardless of
	 * the last time it was downloaded, set this to `0`.
	 */
	public async downloadById (id: string, lastDownload: string | number | Date) {
		return this.download(id, lastDownload);
	}

	////////////////////////////////////
	// Definitions
	//

	public async definitions () {
		return (await this.query<List<BulkDataDefinition>>("bulk-data")).data;
	}

	public async definitionByType (type: BulkDataType) {
		return this.definition(type);
	}

	public async definitionById (id: string) {
		return this.definition(id);
	}

	////////////////////////////////////
	// Internals
	//

	private async download (idOrType: string, lastDownload: string | number | Date) {
		const definition = await this.definition(idOrType);
		if (new Date(lastDownload).getTime() > new Date(definition.updated_at).getTime())
			return undefined;

		const result = await Axios.request<Stream>({
			method: "GET",
			url: definition.download_uri,
			responseType: "stream",
		});

		return result.data;
	}

	private definition (idOrType: string) {
		return this.query<BulkDataDefinition>(["bulk-data", idOrType]);
	}
};