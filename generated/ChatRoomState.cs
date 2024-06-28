// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.34
// 

using Colyseus.Schema;
using Action = System.Action;

namespace MyGame.Schema {
	public partial class ChatRoomState : Schema {
		[Type(0, "string")]
		public string roomName = default(string);

		[Type(1, "string")]
		public string roomOwner = default(string);

		[Type(2, "map", typeof(MapSchema<Player>))]
		public MapSchema<Player> players = new MapSchema<Player>();

		/*
		 * Support for individual property change callbacks below...
		 */

		protected event PropertyChangeHandler<string> __roomNameChange;
		public Action OnRoomNameChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.roomName));
			__roomNameChange += __handler;
			if (__immediate && this.roomName != default(string)) { __handler(this.roomName, default(string)); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(roomName));
				__roomNameChange -= __handler;
			};
		}

		protected event PropertyChangeHandler<string> __roomOwnerChange;
		public Action OnRoomOwnerChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.roomOwner));
			__roomOwnerChange += __handler;
			if (__immediate && this.roomOwner != default(string)) { __handler(this.roomOwner, default(string)); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(roomOwner));
				__roomOwnerChange -= __handler;
			};
		}

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

		protected override void TriggerFieldChange(DataChange change) {
			switch (change.Field) {
				case nameof(roomName): __roomNameChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
				case nameof(roomOwner): __roomOwnerChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
				case nameof(players): __playersChange?.Invoke((MapSchema<Player>) change.Value, (MapSchema<Player>) change.PreviousValue); break;
				default: break;
			}
		}
	}
}
