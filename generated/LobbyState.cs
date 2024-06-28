// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.34
// 

using Colyseus.Schema;
using Action = System.Action;

namespace MyGame.Schema {
	public partial class LobbyState : Schema {
		[Type(0, "map", typeof(MapSchema<Player>))]
		public MapSchema<Player> players = new MapSchema<Player>();

		[Type(1, "map", typeof(MapSchema<LobbyChatRoomList>))]
		public MapSchema<LobbyChatRoomList> chatRoomList = new MapSchema<LobbyChatRoomList>();

		/*
		 * Support for individual property change callbacks below...
		 */

		protected event PropertyChangeHandler<MapSchema<Player>> __playersChange;
		public Action OnPlayersChange(PropertyChangeHandler<MapSchema<Player>> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.players));
			__playersChange += __handler;
			if (__immediate && this.players != null) { __handler(this.players, null); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(players));
				__playersChange -= __handler;
			};
		}

		protected event PropertyChangeHandler<MapSchema<LobbyChatRoomList>> __chatRoomListChange;
		public Action OnChatRoomListChange(PropertyChangeHandler<MapSchema<LobbyChatRoomList>> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.chatRoomList));
			__chatRoomListChange += __handler;
			if (__immediate && this.chatRoomList != null) { __handler(this.chatRoomList, null); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(chatRoomList));
				__chatRoomListChange -= __handler;
			};
		}

		protected override void TriggerFieldChange(DataChange change) {
			switch (change.Field) {
				case nameof(players): __playersChange?.Invoke((MapSchema<Player>) change.Value, (MapSchema<Player>) change.PreviousValue); break;
				case nameof(chatRoomList): __chatRoomListChange?.Invoke((MapSchema<LobbyChatRoomList>) change.Value, (MapSchema<LobbyChatRoomList>) change.PreviousValue); break;
				default: break;
			}
		}
	}
}
