import { Config } from "@markdoc/markdoc";
import Callout from "../components/tags/callout";
import Heading from "../components/heading";
import Card from    "../components/card";
import Superscript from "../components/tags/superscript"
import Break from "@/components/tags/break";

const config: Config = {
    nodes: {
        paragraph: {
            render: 'Paragraph'
        },
        heading: {
            render: 'Heading',
            attributes: {
                level: { type: Number }
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
            },
            children: ['paragraph', 'heading', 'tag', 'fence', 'list', 'item']
        },
        superscript: {
            render: 'Superscript',
            attributes: {}
        },
        break: {
            render: 'Break',
            attributes: {
                level: {
                    type: Number,
                    default: 3
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
    Card: Card,
    Superscript: Superscript,
    Break: Break,
};

export { config, components }