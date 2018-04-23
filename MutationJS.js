/**
 * @desc MutationJs， 记录用户对网络图的操作，并可进行撤销和恢复；
 * */

window.nono = window.nono || {};

/**
 * @desc
 * */
nono.MutationJs = function( list, network ) {

    //list这个变量保存了用户的操作;
    this.list = list;

    //当前回退的索引
    this.index = -1;

    this.network = network;

};

      /**
     * @desc 保存network操作到list;
     * */
nono.MutationJs.prototype.save = function (type, obj ) {
        if(obj){
			//如果当前撤销索引小于列表元素数量，进行了新的数据操作，则回退索引index后面的元素数据
			if(this.index + 1 < this.list.length)
				this.splice(this.index + 1);
			this.index++;
			this.list.push({type: type, data: obj});
		}
    },

    /**
     * @desc  ;
     * */
nono.MutationJs.prototype.reset = function () {
        //清空数组;
        this.list = [];
        this.index = -1;
    },

    /**
     * @desc 把指定index后面的操作删除;
     * */
nono.MutationJs.prototype.splice = function ( index ) {

        this.list.splice( index );

    },

     /**
     * @desc 往回走， 取消回退
     * */
nono.MutationJs.prototype.undo = function () {

		//判断是否可以撤销操作
         if( this.index !== -1) {
			 this.mutation('undo', this.list[this.index]);
			 this.index--;
         };

    },

    /**
     * @desc 往前走， 重新操作
     * */
nono.MutationJs.prototype.redo = function () {

		//判断是否可以重新操作
        if( this.list.length - 1 !== this.index ) {
			this.index++;
			this.mutation('redo', this.list[this.index]);
        };

    },

    /**
     * @desc 判断是否可以撤销操作
     * */
nono.MutationJs.prototype.canUndo = function () {

        return this.index !== -1;

    },

    /**
     * @desc 判断是否可以重新操作;
     * */
nono.MutationJs.prototype.canRedo = function () {

        return this.list.length-1 !== this.index;

    }

    /**
     * @desc 执行撤销或重做操作;
     * */
nono.MutationJs.prototype.mutation = function (operation, obj) {
		var data = obj.data;
        switch(obj.type)
		{
			case 'Add':
				if(operation == 'undo')
					this.removeData(data);
				else
					this.updateData(data);
				break;
			case 'Edit':
				if(operation == 'undo')
					this.updateData(data.undo);
				else
					this.updateData(data.redo);
				break;
			case 'Delete':
				if(operation == 'undo')
					this.updateData(data);
				else
					this.removeData(data);
				break;
			default:
				break;
		}

    }

    /**
     * @desc 删除网络图数据;
     * */
nono.MutationJs.prototype.updateData = function (data) {
		//nodes和edges数据必须为list类型
        if(data.nodes)
			this.network.body.data.nodes.update(data.nodes);
		if(data.edges)
			this.network.body.data.edges.update(data.edges);
    }

    /**
     * @desc 更新网络图数据;
     * */
nono.MutationJs.prototype.removeData = function (data) {
		var ids = []
        if(data.nodes){
			for(var i=0, len=data.nodes.length;i<len;i++){
				ids.push(data.nodes[i].id);
			};
			this.network.body.data.nodes.remove(ids);
		}
			
		if(data.edges){
			ids = [];
			for(var i=0, len=data.edges.length;i<len;i++){
				ids.push(data.edges[i].id);
			};
			this.network.body.data.edges.remove(ids);
		}
    }