import linkModel, {ILinkModel} from './linkModel';
import {Link} from './link';

function findByCode(code: string) {
    return linkModel.findOne<ILinkModel>({
        where: { code } 
    })
}

function findByURL(url: string) {
    return linkModel.findOne<ILinkModel>({
        where: { url } 
    })
}

function add(link: Link) {
    return linkModel.create<ILinkModel>(link);
}

async function hit(code: string) {
    const link = await findByCode(code);
    if(!link) return null;

    link.hits!++;
    await link.save();
    return link;
}

export default {
    findByCode,
    findByURL,
    add,
    hit
}