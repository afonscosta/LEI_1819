package pt.lei.backend.controller;

import pt.lei.backend.SpringBootVuejsApplication;
import pt.lei.backend.domain.Item;
import io.restassured.RestAssured;
import org.apache.http.HttpStatus;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

@RunWith(SpringRunner.class)
@SpringBootTest(
		classes = SpringBootVuejsApplication.class,
		webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class BackendControllerTest {

	@LocalServerPort
	private int port;

	@Before
    public void init() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
    }

	@Test
	public void saysHello() {
		when()
			.get("/api/hello")
		.then()
			.statusCode(HttpStatus.SC_OK)
			.assertThat()
				.body(is(equalTo(BackendController.HELLO_TEXT)));
	}

	@Test
    public void addNewUserAndRetrieveItBack() {
        Item bread = new Item("bread", 1, false);

        Long itemId =
            given()
                .queryParam("name", "bread")
                .queryParam("quantity", 1)
                .queryParam("done", false)
            .when()
                .post("/api/item")
            .then()
                .statusCode(is(HttpStatus.SC_CREATED))
                .extract()
                    .body().as(Long.class);

	    Item responseItem =
            given()
                    .pathParam("id", itemId)
                .when()
                    .get("/api/item/{id}")
                .then()
                    .statusCode(HttpStatus.SC_OK)
                    .assertThat()
                        .extract().as(Item.class);

	    // Did Norbert came back?
		assertThat(responseItem.getName(), is("bread"));
        assertThat(responseItem.getQuantity(), is(1));
        assertThat(responseItem.getDone(), is(false));
    }

}
