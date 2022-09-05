export function saveCookie({...args}) { // name, domain, path, expires, size
  // saveCookie({name: 'token', value: 'VALUE', expires: days.toUTCString(), domain: 'domain'});
  let today = new Date(Date.now());
  const expireDate = new Date(today.setDate(today.getDate() + args.expiresInDays)).toUTCString(); // new Date(Date.now().setDate(Date.now().getDate() + 7)).toUTCString();
  document.cookie = `${args.name}=${args.value}; expires=${expireDate}; SameSite=None` // ; domain=${args.domain}
}

export function saveLocal({...args}) {
  // saveLocal({name: 'token', value: 'VALUE', set: true});
  // saveLocal({name: 'token', get: true});
  // saveLocal({name: 'token', remove: true});
  if(args.set) {
    localStorage.setItem(args.name, args.value)
  } else if(args.get) {
    return localStorage.getItem(args.name)
  } else if(args.remove) {
    localStorage.removeItem(args.name)
  } else {
    return null
  }
}

export function saveSession({...args}) {
  if(args.set) {
    sessionStorage.setItem(args.name, args.value);
  } else if(args.get) {
    return sessionStorage.getItem(args.name);
  } else {
    return null
  }
}
