import { Config } from "@markdoc/markdoc";
import Callout from "../../components/tags/callout";
import Heading from "../../components/heading";
import Card from    "../../components/card";

const config: Config = {
    nodes: {
        paragraph: {
            render: 'Paragraph'
        },
        heading: {
            render: 'Heading',
            attributes: {
                level: { type: String }
            }
        },
    },
    tags: {
        callout: {
            render: 'Callout',
            attributes: {
                title: {
                    type: String,
                    default: "default title",
                },
            }
        },
        card: {
            render: 'Card',
            attributes: {
                description: {
                    type: String,
                    default: "default description"
                },
            }
        },
    }
};

const components = {
    Paragraph: ({ children }: any) => {
        return <div className="text-base pb-2">{children}</div>
    },
    Heading: Heading,
    Callout: Callout,
    Card: Card
};

export { config, components }