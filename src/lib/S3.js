import matchJSONToSchema from 'simple-json-match'

export const setup = async (opts, _this) => {
    _this.S3 = {}
    _this.S3.OBJECT_STORE_PREFIX = opts.S3?.OBJECT_STORE_PREFIX || ''
    _this.S3.OBJECT_STORE_SUFFIX = opts.S3?.OBJECT_STORE_SUFFIX || `___NODE_${process.env.HOSTNAME||''}${process.env.NODE_APP_INSTANCE||''}${process.env.PORT||''}${process.env.pm2_id||''}${process.env.username||''}${process.env.pm_exec_path||''}`
    _this.S3.client = opts.S3?.client
    return _this.S3.client
}

export const checkEvent = async (obj, opts, _this) => {
    var {event, user} = obj
    var _eventPath = `${_this.S3.OBJECT_STORE_PREFIX}users/${user.id}/events/${event}/`
    var _result = await _this.S3.client.list(_eventPath)
    if(_result.Contents){
        // if(DEBUG) console.log('\t\t',_eventPath,' got contents', _result.Contents.length);
        var _data = [], query = false
        if(opts.match){
            query = (x => matchJSONToSchema(x, opts.match))
        }
        var x
        //console.log('\t',event, 'got ', _result.Contents?.length);
        for (var i=0;i<_result.Contents.length; i++){
            x = _result.Contents[i]
            var _xy = await _this.S3.client.get(x.Key)
            
            var _parsed = JSON.parse(_xy)
            if(query){
                // console.log('check if', _parsed.data, 'matches ', opts.match);
                if(query(_parsed.data)){
                    _data.push(_parsed.data)
                }
            }else{
                _data.push(_parsed.data)
            }
        }
        var _last = await _this.S3.client.get(`${_this.S3.OBJECT_STORE_PREFIX}users/${user.id}/last.json`)
        _last = _last ? JSON.parse(_last) : null
        //console.log('_last:',_last);
        if(_last && _last.NODE.indexOf(_this.S3.OBJECT_STORE_SUFFIX)<0){
            // console.log(`checkEvent:[${event}] stop since node got `+ _last.event);
            _this.setInactive(true)
            return new Error('STOP_this node must stop since newer node found')
        }else{
            _this.setInactive(false)
        }
        if(!_data.length){
            // console.log(`checkEvent:[${event}] no match return `, _data)
            return null
        }else{
            // console.log('\tcheckEvent: look for ', _eventPath, 'got', _data);
            // console.log(`checkEvent:[${event}] has data: inactive:`, _this.inactive);
            return _data
        }
    }
    return
}

export const setEvent = async (obj, opts, _this) => {
    var {event, user, data} = obj
    data = data || {}
    // console.log('setEvent called with event:', event, ' user:', user, ' data:', data, 'opts:', opts);
    if(!opts?.system){
        var _path = `${_this.S3.OBJECT_STORE_PREFIX}users/${user.id}/last.json`
        await _this.S3.client.put(_path, {NODE: _this.S3.OBJECT_STORE_SUFFIX, event, data, user})
    }
    _path = `${_this.S3.OBJECT_STORE_PREFIX}users/${user.id}/events/${event}/${data.id||Date.now()}${_this.S3.OBJECT_STORE_SUFFIX}.json`
    await _this.S3.client.put(_path, obj)
    // console.log(`\tsetEvent:wrote ${_path}`);// with `,obj);
    if(event == 'identify'){
        var _profilePath = `${_this.S3.OBJECT_STORE_PREFIX}users/${user.id}/profile.json`
        await _this.S3.client.put(_profilePath, {...data, ...user})
        // console.log(`\twrote profile ${_profilePath}`);
    }
    return _path
}
