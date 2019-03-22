package pt.lei.backend.domain;

import javax.persistence.*;

@Entity
@Table(name="items")
public class Item {

    // PrimaryKey
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private int quantity;
    private boolean done;

    protected Item() {}

    public Item(String name, int quantity, boolean done) {
        this.name = name;
        this.quantity = quantity;
        this.done = done;
    }

    @Override
    public String toString() {
        return String.format(
                "Item[id=%d, name='%s', quantity='%d', done='%b']",
                id, name, quantity, done);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public boolean getDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
