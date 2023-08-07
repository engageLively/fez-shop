import { Image, part, Morph } from 'lively.morphic';
import { pt, Color } from 'lively.graphics';
import { ButtonDefault } from 'lively.components/buttons.cp.js';
export class ShoppingBag extends Image {
  static get properties () {
    return {
      inventory: { defaultValue: null }
    };
  }

  onMouseDown (evt) {
    this.owner.bagSelected(this);
  }
}

const bags = [
  {
    name: 'pack1',
    url: 'https://matt.engageLively.com/assets/ITF/pack1.png',
    price: 298,
    camels: 3,
    guide: 1,
    'water  skins': 14,
    'food crates': 4,
    'sword bags': 6,
    spices: 8,
    'glass bead bags': 10,
    'islamic books': 0
  },
  {
    name: 'pack2',
    url: 'https://matt.engageLively.com/assets/ITF/pack2.png',
    price: 274,
    camels: 5,
    guides: 3,
    'water  skins': 21,
    'food crates': 7,
    'sword bags': 0,
    spices: 0,
    'glass bead bags': 10,
    'islamic books': 0
  },
  {
    name: 'pack3',
    url: 'https://matt.engageLively.com/assets/ITF/pack3.png',
    price: 300,
    camels: 4,
    guides: 3,
    'water  skins': 28,
    'food crates': 8,
    'sword bags': 0,
    spices: 0,
    'glass bead bags': 0,
    'islamic books': 4
  },
  {
    name: 'pack1',
    url: 'https://matt.engageLively.com/assets/ITF/pack4.png',
    price: 285,
    camels: 3,
    guides: 2,
    'water  skins': 24,
    'food crates': 4,
    'sword bags': 0,
    spices: 6,
    'glass bead bags': 6,
    'islamic books': 1
  },
  {
    name: 'pack5',
    url: 'https://matt.engageLively.com/assets/ITF/pack5.png',
    price: 195,
    camels: 6,
    guides: 2,
    'water  skins': 34,
    'food crates': 4,
    'sword bags': 0,
    spices: 0,
    'glass bead bags': 0,
    'islamic books': 0
  }

];

// new Shop().openInWorld()
export class Shop extends Morph {
  onLoad () {
    // native bagExtent is 398x373
    const bagScale = 0.75;
    const bagExtent = pt(398, 373).scaleBy(bagScale);
    const margins = {
      horizontal: 50, vertical: 50, inter: 15
    };
    const xPositions = [
      margins.horizontal, bagExtent.x + margins.inter + margins.horizontal, 2 * (bagExtent.x + margins.inter) + margins.horizontal
    ];
    const yPositions = [
      margins.vertical, margins.vertical + margins.inter + bagExtent.y
    ];

    this.extent = pt(2 * (margins.horizontal + margins.inter) + 3 * bagExtent.x, 2 * (margins.vertical + bagExtent.y) + margins.inter);
    let positions = [];
    yPositions.forEach(yPos => {
      xPositions.forEach(xPos => {
        positions.push(pt(xPos, yPos));
      });
    });

    this._setPosition();
    this.bags = bags.map((bag, i) => {
      const shoppingBag = new ShoppingBag({
        imageUrl: bag.url,
        extent: bagExtent,
        borderColor: Color.blue,
        position: positions[i]
      });
      shoppingBag.inventory = bag;
      this.addMorph(shoppingBag);
      return shoppingBag;
    });
    this.startButton = part(ButtonDefault, {
      fill: Color.rgb(245, 124, 0),
      position: positions[5],
      extent: pt(144, 52),
      name: 'start'
    });

    const label = this.startButton.getSubmorphNamed('label');
    label.fontFamily = 'Sans-serif';
    label.fontSize = 24;
    label.textString = 'Purchase';
    label.fontColor = Color.white;
    this.addMorph(this.startButton);
    this.startButton.viewModel.action = _ => { this.transmitValue(); };
    this.bagSelected(this.bags[0]);
  }

  _setPosition () {
    this.scale = Math.min(1, $world.extent.x / 690, $world.extent.y / 600);
    const actualPixels = pt(690, 600).scaleBy(this.scale);
    this.position = $world.extent.subPt(actualPixels).scaleBy(0.5);
  }

  transmitValue () {
    const inventory = this.selectedBag.inventory;
    inventory.shells = 300 - inventory.price;
    const message = {
      action: 'purchase completed',
      inventory: inventory

    };
    console.log(message); // take out when integrated
    window.postMessage(inventory, '*');
  }

  bagSelected (bag) {
    this.selectedBag = bag;
    this.showBags();
  }

  showBags () {
    this.bags.forEach(bag => bag.borderWidth = 0);
    this.selectedBag.borderWidth = 10;
  }
}
