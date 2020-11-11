import {DiceRoller, Parser} from 'rpg-dice-roller';

export class DiceItem {
  public d: number | undefined;
  public value: number | undefined;
}

/**
 * trasforma le giocate della classe rpg-dice-roller in
 * DiceItem utilizzabili dalla libreria grafica.
 *
 */
export class MyRoller {

  constructor() {
    const result = this.roll('4d6+30+d4+5+10d20');
    // console.log('result', (result.rolls as any).total);
  }

  /**
   * riceva una stringa nella sintazzi rpg-dice-roller
   * @param notation
   */
  public roll(notation: string): { rolls: any, dices: DiceItem[] } {
    const roller = new DiceRoller();
    const roll = roller.roll(notation);
    const rolls = roll.toJSON();
    const parsedRolls = roll.rolls
      .map((value) => (value as any)
        .rolls.map((item: any) => item.value))
      .reduce((prev, curr) => [...prev, ...curr]);

    const dices: DiceItem[] = Parser.parse(notation)
      .filter((valueA, iA) => !!valueA.qty)
      .map(({qty, max}) => ({qty, max}))
      .reduce((prev: any[], curr: { qty: number, max: number }) => {
        let result = [];
        for (let i = 0; i < curr.qty; i++) {
          result.push(curr.max);
        }
        result = [...prev, ...result];
        return result;
      }, [])
      .map((d: number, i: number) => {
        const value = parsedRolls[i];
        return {d, value} as DiceItem;
      });
    return {rolls, dices};
  }

}
