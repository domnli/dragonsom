tuixiangzi={
                init:function(am){
                        tuixiangzi.appManage=am;
                        //am.activateDebugger();
                        tuixiangzi.grid=am.addObj(new iio.Grid(0,0,parseInt(leveldata.column),parseInt(leveldata.row),50).setAlpha(0));
                        
                        //console.log(this);
                        am.setBGColor('gray');
                        tuixiangzi.loadRes();
                        tuixiangzi.loadResIntvl=setInterval('tuixiangzi.checkRes()',50);
                        
                },
                checkRes:function(){
                    for(var i in this.res){
                        if(typeof this.res[i] != 'function' && undefined == this.res[i].loaded){
                            return false;
                        }
                    }
                    clearInterval(this.loadResIntvl);
                    this.createMap();
                    return true;
                },
                loadRes:function(){
                    var res=this.res=[];
                    var srcs=['http://ftp_dml.hzsx15.badudns.cc/Public/images/wall.png',
                              'http://ftp_dml.hzsx15.badudns.cc/Public/images/box.png',
                              'http://ftp_dml.hzsx15.badudns.cc/Public/images/up.png',
                              'http://ftp_dml.hzsx15.badudns.cc/Public/images/down.png',
                              'http://ftp_dml.hzsx15.badudns.cc/Public/images/left.png',
                              'http://ftp_dml.hzsx15.badudns.cc/Public/images/right.png'
                             ];
                    for(var i in srcs){
                        if('function' == typeof srcs[i])
                            continue;
                        res[i]=new Image();
                        res[i].src=srcs[i];
                        res[i].onload=function(){
                            this.loaded=true;
                        }
                    }

                },
                createMap:function(){
                            var map=this.convertRC(leveldata.map);
                            for(var i in map){
                                for(var j in map[i]){
                                    switch(map[i][j]){
                                        case 0:
                                        break;
                                        case 1://墙
                                            this.grid.cells[i][j].wall=true;
                                            this.appManage.addToGroup('walls',
                                                        new iio.SimpleRect(this.grid.getCellCenter(i,j),50)
                                                                .createWithImage(this.res[0]),0);
                                        break;
                                        case 2://蓝色活动区域
                                            this.appManage.addToGroup('blues',
                                                        new iio.SimpleRect(this.grid.getCellCenter(i,j),50)
                                                                .setFillStyle('blue'),0);
                                        break;
                                        case 3://红色目标区域
                                            this.appManage.addToGroup('reds',
                                                        new iio.SimpleRect(this.grid.getCellCenter(i,j),50)
                                                                .setFillStyle('red'),0);
                                        break;
                                    }
                                }
                            }
                            this.createBox();
                            this.createPerson();
                            this.collision();
                        },
                createBox:function(){
                   var boxes=leveldata.boxes;
                    for(var i in boxes){
                        if('function' == typeof boxes[i])
                            continue;
                        this.appManage.addToGroup('boxes',
                                new iio.SimpleRect(this.grid.getCellCenter(boxes[i].x,boxes[i].y),50)
                                        .createWithImage(this.res[1]),1);
                    }
                },
                createPerson:function(){
                    var person=new iio.SimpleRect(this.grid.getCellCenter(leveldata.person.x,leveldata.person.y),50)
                                        .createWithAnim([this.res[2],this.res[3],this.res[4],this.res[5]]);
                    this.person=person;
                    this.appManage.addToGroup('person',person,1);
                    window.addEventListener('keydown', tuixiangzi.addKeyboard);
                    this.appManage.canvas.addEventListener('click',tuixiangzi.addMouse);
                },
                addMouse:function(event){
                    document.oncontextmenu=function(){return false;};document.onselectstart=function(){return false;};
                    var map=tuixiangzi.convertRC(leveldata.map);
                    var grid=tuixiangzi.grid;
                    var personcoor=grid.getCellAt(tuixiangzi.person.pos);
                    var moveto=grid.getCellAt(tuixiangzi.appManage.getEventPosition(event));
                    if(moveto.x == personcoor.x && moveto.y<personcoor.y && map[personcoor.x][personcoor.y-1] != 1){
                        //上
                        tuixiangzi.person.move={x:0,y:-grid.res.y};
                        moveto.y=personcoor.y-1;
                        tuixiangzi.person.setAnimFrame(0).setPos(grid.getCellCenter(moveto));
                    }
                    if(moveto.x == personcoor.x && moveto.y>personcoor.y && map[personcoor.x][personcoor.y+1] != 1){
                        //下
                        tuixiangzi.person.move={x:0,y:grid.res.y};
                        moveto.y=personcoor.y+1;
                        tuixiangzi.person.setAnimFrame(1).setPos(grid.getCellCenter(moveto));
                    }
                    if(moveto.y==personcoor.y && moveto.x<personcoor.x && map[personcoor.x-1][personcoor.y] != 1){
                        //左
                        tuixiangzi.person.move={x:-grid.res.x,y:0};
                        moveto.x=personcoor.x-1;
                        tuixiangzi.person.setAnimFrame(2).setPos(grid.getCellCenter(moveto));
                    }
                    if(moveto.y==personcoor.y && moveto.x>personcoor.x && map[personcoor.x+1][personcoor.y] != 1){
                        //右
                        tuixiangzi.person.move={x:grid.res.x,y:0};
                        moveto.x=personcoor.x+1;
                        tuixiangzi.person.setAnimFrame(3).setPos(grid.getCellCenter(moveto));
                    }
                    tuixiangzi.appManage.draw().update();
                    tuixiangzi.checkWin();
                },
                addKeyboard:function(event){
                        event.preventDefault();
                        var map=tuixiangzi.convertRC(leveldata.map);
                        var grid=tuixiangzi.grid;
                        var person=tuixiangzi.person;
                        switch(event.keyCode){
                            case 37://left arrow
                            case 65://a
                                var moveto=grid.getCellAt(new iio.Vec(person.pos.x-grid.res.x,person.pos.y));
                                if(moveto && map[moveto.x][moveto.y] !=undefined && map[moveto.x][moveto.y] != 1){
                                    person.move={x:-grid.res.x,y:0};
                                    person.setAnimFrame(2).setPos(grid.getCellCenter(moveto));
                                    tuixiangzi.appManage.draw().update();
                                }
                            break;
                            case 38://up arrow
                            case 87://w
                                var moveto=grid.getCellAt(new iio.Vec(person.pos.x,person.pos.y-grid.res.y));
                                if(moveto && map[moveto.x][moveto.y] !=undefined && map[moveto.x][moveto.y] != 1){
                                    person.move={x:0,y:-grid.res.y};
                                    person.setAnimFrame(0).setPos(grid.getCellCenter(moveto));
                                    tuixiangzi.appManage.draw().update();
                                }
                            break;
                            case 39://right arrow
                            case 68://d
                                var moveto=grid.getCellAt(new iio.Vec(person.pos.x+grid.res.x,person.pos.y));
                                if(moveto && map[moveto.x][moveto.y] !=undefined && map[moveto.x][moveto.y] != 1){
                                    person.move={x:grid.res.x,y:0};
                                    person.setAnimFrame(3).setPos(grid.getCellCenter(moveto));
                                    tuixiangzi.appManage.draw().update();
                                }
                            break;
                            case 40://down arrow
                            case 83://s
                                var moveto=grid.getCellAt(new iio.Vec(person.pos.x,person.pos.y+grid.res.y));
                                if(moveto && map[moveto.x][moveto.y] !=undefined && map[moveto.x][moveto.y] != 1){
                                    person.move={x:0,y:grid.res.y};
                                    person.setAnimFrame(1).setPos(grid.getCellCenter(moveto));
                                    tuixiangzi.appManage.draw().update();
                                }
                            break;
                        }
                        tuixiangzi.checkWin();
                    },
                collision:function(){
                    this.appManage.setCollisionCallback('person','boxes',function(p,b){
                        var grid=tuixiangzi.grid,map=tuixiangzi.convertRC(leveldata.map);
                        var moveto=grid.getCellAt(new iio.Vec(b.pos.x+p.move.x,b.pos.y+p.move.y));
                        var boxes=tuixiangzi.appManage.getGroup('boxes'),isbox=false;
                        var movetopos=grid.getCellCenter(moveto);
                        for(var i in boxes){
                            if('function' == typeof boxes[i])
                                continue;
                            if(boxes[i].pos.x == movetopos.x && boxes[i].pos.y == movetopos.y){
                                isbox=true;
                            }
                        }
                        if(map[moveto.x][moveto.y] == undefined)
                            return;
                        if(map[moveto.x][moveto.y] != 1 && !isbox){
                            b.setPos(grid.getCellCenter(moveto));    
                            tuixiangzi.appManage.draw().update();
                        }else{
                            p.setPos(p.pos.x-p.move.x,p.pos.y-p.move.y);
                            tuixiangzi.appManage.draw().update();
                        }
                    });
                    this.appManage.setCollisionCallback('reds','boxes',function(r,b){
                        
                    });
                },
                checkWin:function(){
                    var grid=this.grid,amount=0;
                    var boxes=this.appManage.getGroup('boxes'),reds=this.appManage.getGroup('reds');
                    for(var i in boxes){
                        if('function' == typeof boxes[i])
                            continue;
                        for(var j in reds){
                            if('function' == typeof reds[j])
                                continue;
                            if(reds[j].pos.x == boxes[i].pos.x && reds[j].pos.y ==boxes[i].pos.y){
                                amount++;
                            }
                        }
                    }
                    if(amount == boxes.length){
                        this.success();
                    }
                },
                success:function(){
                    this.removeKeyboard();
                },
                removeKeyboard:function(){
                     window.removeEventListener('keydown', tuixiangzi.addKeyboard);
                     console.log(tuixiangzi.appManage);
                     if(tuixiangzi.appManage){
                        tuixiangzi.appManage.canvas.removeEventListener('click',tuixiangzi.addMouse);
                     }
                },
                convertRC:function(map){
                    var cmap=[];
                    for(var i=0;i<map.length;i++){
                        for(var j=0;j<map[i].length;j++){
                            if("undefined" == typeof cmap[j])
                                cmap[j]=[];
                            cmap[j][i]=map[i][j];
                        }
                    }
                    return cmap;
                }
    };