'use strict';

module.exports = muunnettavaOlio =>
    Object.assign(muunnettavaOlio,{
        id: +muunnettavaOlio.id,
        hinta: +muunnettavaOlio.hinta
    });