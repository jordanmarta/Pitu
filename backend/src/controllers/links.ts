import { Request, Response } from 'express';
import { Link } from '../models/link';
import linksRepository from '../models/linksRepository';
import ResponseLink from '../models/responseLink';

function generateCode() {
    let text = '';
    const possible = 'ABCDEFGHIJLMNOPQRSTUVXZabcdefgijlmnopqrstuvxz0123456789';
    for(let i=0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

async function postLink(req: Request, res: Response){
    const link = req.body as Link;
    link.code = generateCode();
    link.hits = 0;
    
    if(await checkIfUrlExists(link.url) === true) {
        return res.status(203).json(
            new ResponseLink(false, "URL já cadastrada na base de dados.")
        );
    }

    const result = await linksRepository.add(link);

    if(!result.id)
        return res.status(400).json(
            new ResponseLink(false, "Falha interna ao cadastrar a URL.")
        );

    link.id = result.id!;

    var response = new ResponseLink(true, "");
    response.setLink(link);

    res.status(201).json(response);
}

async function getLink(req: Request, res: Response){
    const code = req.params.code as string;
    const link = await linksRepository.findByCode(code);

    if(!link)
        res.sendStatus(404);
    else
        res.json(link);
}

async function hitLink(req: Request, res: Response){
    const code = req.params.code as string;
    const link = await linksRepository.hit(code);

    if(!link)
        res.sendStatus(404);
    else 
        res.json(link);
}

async function checkIfUrlExists(pUrl: string) {
    console.log('cheguei ate aqui!!!')
    const item = await linksRepository.findByURL(pUrl);
    console.log(item)
    return item !== null;
}

export default {
    postLink,
    getLink,
    hitLink,
    checkIfUrlExists
}