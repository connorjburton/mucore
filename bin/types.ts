export type SearchResult = {
    style: string[],
    thumb: string,
    title: string,
    country: string,
    format: string[],
    uri: string,
    community: {
        want: number,
        have: number
    },
    label: string[],
    catno: string,
    year: string,
    genre: string[],
    resource_url: string,
    type: string,
    id: number
}

export type SearchResponse = {
    pagination?: {
        per_page: number,
        pages: number,
        page: number,
        urls: {
            last: string,
            next: string
        },
        items: number
    },
    results: SearchResult[]
}

type Artist = {
    anv: string,
    id: number,
    join: string,
    name: string,
    resource_url: string,
    role: string,
    tracks: string
}

type Contributor = {
    resource_url: string,
    username: string
}

type Company = {
    catno: string,
    entity_type: string,
    entity_type_name: string,
    id: number,
    name: string,
    resource_url: string
}

type Format = {
    descriptions: string[],
    name: string,
    qty: string
}

type Identifier = {
    type: string,
    value: string
}

export type Image = {
    height: number,
    resource_url: string,
    type?: string,
    uri: string,
    uri150?: string,
    width: number
}

type Label = {
    catno: string,
    entity_type: string,
    id: number,
    name: string,
    resource_url: string
}

export type Track = {
    duration: string,
    position: string,
    title: string,
    type_: string
}

type Video = {
    description?: string,
    duration: number,
    embed: boolean,
    title: string,
    uri: string
}

export type Release = {
    title: string,
    id: number,
    artists: Artist[],
    artists_sort: string,
    data_quality: string,
    thumb: string,
    community: {
        contributors: Contributor[],
        data_quality: string,
        have: number,
        rating: {
            average: number,
            count: number
        }
        status: string,
        submitter: Contributor,
        want: number
    },
    companies: Company[],
    country?: string,
    date_added: string,
    date_changed: string,
    estimated_weight?: number,
    extraartists: Artist[],
    format_quantity: number,
    formats: Format[],
    genres: string[],
    identifiers: Identifier[],
    images?: Image[],
    labels: Label[],
    lowest_price: number | null,
    master_id?: number,
    master_url?: string,
    notes?: string,
    num_for_sale: number,
    released?: string,
    released_formatted?: string,
    resource_url: string,
    series: unknown[],
    status: string,
    styles: string[],
    tracklist?: Track[],
    uri: string,
    videos?: Video[],
    year: number
}