declare const findSubmissionPage: () => HTMLElement | null;
declare const findDownloadButton: () => Element | undefined;
declare const getSubmissionUrl: () => {
    url: string;
    downloadUrl: string | undefined;
} | undefined;
declare const getSubmissionSidebar: () => Element | null;
declare const getSubmissionTags: () => string[];
declare const getSubmissionInfo: () => {
    submissionType?: undefined;
    category?: undefined;
    species?: undefined;
    genders?: undefined;
} | {
    submissionType: string | null | undefined;
    category: string | null | undefined;
    species: (string | null | undefined)[];
    genders: (string | null | undefined)[];
};
declare enum Ratings {
    general = "SFW",
    mature = "NSFW",
    adult = "NSFW"
}
declare const getSubmissionRating: () => Ratings | undefined;
declare const getSubmissionDescriptors: () => {
    title?: undefined;
    description?: undefined;
    descriptionNodes?: undefined;
} | {
    title: string | undefined;
    description: string;
    descriptionNodes: ({
        type: string;
        href: string | undefined;
        text: string;
    } | {
        type: string;
        text: string;
    })[];
};
declare const getAuthor: () => {
    name?: undefined;
    profileUrl?: undefined;
} | {
    name: string;
    profileUrl: string;
};
declare const getPublishDate: () => Date | undefined;
declare const getSubmissionData: () => {
    publishedAt: Date | undefined;
    author: {
        name?: undefined;
        profileUrl?: undefined;
    } | {
        name: string;
        profileUrl: string;
    };
    tags: string[];
    rating: Ratings | undefined;
    title?: undefined;
    description?: undefined;
    descriptionNodes?: undefined;
    url?: string | undefined;
    downloadUrl?: string | undefined;
    submissionType?: undefined;
    category?: undefined;
    species?: undefined;
    genders?: undefined;
} | {
    publishedAt: Date | undefined;
    author: {
        name?: undefined;
        profileUrl?: undefined;
    } | {
        name: string;
        profileUrl: string;
    };
    tags: string[];
    rating: Ratings | undefined;
    title: string | undefined;
    description: string;
    descriptionNodes: ({
        type: string;
        href: string | undefined;
        text: string;
    } | {
        type: string;
        text: string;
    })[];
    url?: string | undefined;
    downloadUrl?: string | undefined;
    submissionType?: undefined;
    category?: undefined;
    species?: undefined;
    genders?: undefined;
} | {
    publishedAt: Date | undefined;
    author: {
        name?: undefined;
        profileUrl?: undefined;
    } | {
        name: string;
        profileUrl: string;
    };
    tags: string[];
    rating: Ratings | undefined;
    title?: undefined;
    description?: undefined;
    descriptionNodes?: undefined;
    url?: string | undefined;
    downloadUrl?: string | undefined;
    submissionType: string | null | undefined;
    category: string | null | undefined;
    species: (string | null | undefined)[];
    genders: (string | null | undefined)[];
} | {
    publishedAt: Date | undefined;
    author: {
        name?: undefined;
        profileUrl?: undefined;
    } | {
        name: string;
        profileUrl: string;
    };
    tags: string[];
    rating: Ratings | undefined;
    title: string | undefined;
    description: string;
    descriptionNodes: ({
        type: string;
        href: string | undefined;
        text: string;
    } | {
        type: string;
        text: string;
    })[];
    url?: string | undefined;
    downloadUrl?: string | undefined;
    submissionType: string | null | undefined;
    category: string | null | undefined;
    species: (string | null | undefined)[];
    genders: (string | null | undefined)[];
};
declare const runContentScript: () => Promise<void>;
//# sourceMappingURL=index.d.ts.map