import {Link} from './link';

class ResponseLink {
  status: Boolean;
  msg: string;
  link: Link;

  constructor(pStatus = false, pMsg = "") {
    this.status = pStatus;
    this.msg = pMsg;
  };

  setLink(param: Link) {
    this.link = param;
  }
}

export default ResponseLink;